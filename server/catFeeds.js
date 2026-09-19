import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The "feed my cat" counter, shared by the Vercel function (api/feed-cat.js)
 * and the dev-server middleware in vite.config.js.
 *
 * Every feed adds one to the total, so the number on the board is fish eaten,
 * not people. A salted hash of each visitor's IP is kept alongside it, only so a
 * first-timer can be told apart from someone coming back; the IP itself is never
 * stored, which keeps personal data out of it.
 */

const KEY = "cat:feeders";
const TOTAL = "cat:fed";

export const hashVisitor = (ip, salt) =>
  createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);

export const clientIp = (headers, fallback) => {
  const real = headers["x-real-ip"];
  const forwarded = headers["x-forwarded-for"];
  if (typeof real === "string" && real) return real;
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return fallback || "unknown";
};

/** Upstash Redis over REST — what Vercel's Redis integration provisions. A set dedupes for free. */
export const redisStore = (url, token) => {
  const run = async (commands) => {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`Redis responded ${res.status}`);
    return (await res.json()).map((r) => {
      if (r.error) throw new Error(r.error);
      return r.result;
    });
  };
  // The set's size is the floor: it carries over any total from when this
  // counted unique feeders rather than fish.
  const total = ([fed, feeders]) => Math.max(Number(fed) || 0, Number(feeders) || 0);
  return {
    count: async () => total(await run([["GET", TOTAL], ["SCARD", KEY]])),
    add: async (id) => {
      const [added, fed, feeders] = await run([
        ["SADD", KEY, id],
        ["INCR", TOTAL],
        ["SCARD", KEY],
      ]);
      return { added: added === 1, count: total([fed, feeders]) };
    },
  };
};

/** A plain JSON file, for local development. Writes are queued so two feeds can't interleave. */
export const fileStore = (file) => {
  const read = async () => {
    try {
      const data = JSON.parse(await readFile(file, "utf8"));
      // `count` is what the old shape called its unique-feeder tally
      return { total: data.total ?? data.count ?? 0, feeders: data.feeders ?? [] };
    } catch {
      return { total: 0, feeders: [] };
    }
  };
  let queue = Promise.resolve();
  return {
    count: async () => (await read()).total,
    add: (id) => {
      const job = queue.then(async () => {
        const data = await read();
        const added = !data.feeders.includes(id);
        if (added) data.feeders.push(id);
        data.total += 1;
        data.updatedAt = new Date().toISOString();
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, JSON.stringify(data, null, 2));
        return { added, count: data.total };
      });
      queue = job.catch(() => {});
      return job;
    },
  };
};

/** GET → { count }, fish so far. POST → { count, first }, `first` false for a returning feeder. */
export const handleFeed = async ({ method, ip, store, salt }) => {
  if (method === "GET") return { status: 200, body: { count: await store.count() } };
  if (method === "POST") {
    const { added, count } = await store.add(hashVisitor(ip, salt));
    return { status: 200, body: { count, first: added } };
  }
  return { status: 405, body: { error: "Method not allowed" } };
};
