import { clientIp, handleFeed, redisStore } from "../server/catFeeds.js";

/**
 * Vercel function behind the footer's "feed my cat" widget.
 *
 * Needs, in the Vercel project's environment:
 * - KV_REST_API_URL / KV_REST_API_TOKEN — added automatically when an Upstash
 *   Redis store is connected (Storage → Create → Upstash for Redis). The
 *   UPSTASH_REDIS_REST_* names work too.
 * - CAT_FEED_SALT — any long random string; it keeps the stored IP hashes from
 *   being reversed.
 *
 * Without them it answers 503 and the widget still plays, just without a count.
 */
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const salt = process.env.CAT_FEED_SALT;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !token || !salt) return res.status(503).json({ error: "Counter not configured" });

  try {
    const { status, body } = await handleFeed({
      method: req.method,
      ip: clientIp(req.headers),
      store: redisStore(url, token),
      salt,
    });
    return res.status(status).json(body);
  } catch {
    return res.status(502).json({ error: "Counter unavailable" });
  }
}
