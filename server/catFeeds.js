import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The "feed my cat" counter, shared by the Vercel function (api/feed-cat.js)
 * and the dev-server middleware in vite.config.js.
 *
 * A visitor is counted once per IP. The IP itself is never stored: it is
 * salted and hashed, which is enough to recognise a repeat visit without
 * keeping personal data around.
 */

const KEY = "cat:feeders";

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
  return {
    count: async () => (await run([["SCARD", KEY]]))[0],
    add: async (id) => {
      const [added, count] = await run([["SADD", KEY, id], ["SCARD", KEY]]);
      return { added: added === 1, count };
    },
  };
};

/** A plain JSON file, for local development. Writes are queued so two feeds can't interleave. */
export const fileStore = (file) => {
  const read = async () => {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      return { count: 0, feeders: [] };
    }
  };
  let queue = Promise.resolve();
  return {
    count: async () => (await read()).count,
    add: (id) => {
      const job = queue.then(async () => {
        const data = await read();
        const added = !data.feeders.includes(id);
        if (added) {
          data.feeders.push(id);
          data.count = data.feeders.length;
          data.updatedAt = new Date().toISOString();
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, JSON.stringify(data, null, 2));
        }
        return { added, count: data.count };
      });
      queue = job.catch(() => {});
      return job;
    },
  };
};

/** GET → { count }. POST → { count, first } where `first` is false for a repeat visitor. */
export const handleFeed = async ({ method, ip, store, salt }) => {
  if (method === "GET") return { status: 200, body: { count: await store.count() } };
  if (method === "POST") {
    const { added, count } = await store.add(hashVisitor(ip, salt));
    return { status: 200, body: { count, first: added } };
  }
  return { status: 405, body: { error: "Method not allowed" } };
};
