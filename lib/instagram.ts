import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { redisCommand } from "@/lib/redis";

const HOUR = 60 * 60 * 1000;
const WEEK = 7 * 24 * HOUR;
const STATE_TTL = 90 * 24 * 60 * 60;

const imageUrl = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    !url.port &&
    !url.username &&
    !url.password &&
    /\.(cdninstagram\.com|fbcdn\.net)$/.test(url.hostname)
  );
});
const postUrl = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    ["instagram.com", "www.instagram.com"].includes(url.hostname) &&
    !url.port &&
    !url.username &&
    !url.password &&
    /^\/(p|reel|tv)\/[^/]+\/?$/.test(url.pathname)
  );
});
const postSchema = z.object({
  id: z.string(),
  image: imageUrl,
  href: postUrl,
  timestamp: z.string().refine((value) => Number.isFinite(Date.parse(value))),
});
export type InstagramPost = z.infer<typeof postSchema>;

const mediaSchema = z.object({
  id: z.string(),
  media_type: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  media_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  permalink: z.string(),
  timestamp: z.string(),
  children: z
    .object({
      data: z.array(
        z.object({
          media_type: z.string(),
          media_url: z.string().optional(),
          thumbnail_url: z.string().optional(),
        }),
      ),
    })
    .optional(),
});

export function parseInstagramPosts(value: unknown): InstagramPost[] {
  const { data } = z.object({ data: z.array(z.unknown()) }).parse(value);
  const posts = data.flatMap((item) => {
    const media = mediaSchema.safeParse(item);
    if (!media.success) return [];
    const m = media.data;
    const first = m.children?.data[0];
    const image =
      m.media_type === "VIDEO"
        ? m.thumbnail_url
        : m.media_url || (first?.media_type === "VIDEO" ? first.thumbnail_url : first?.media_url);
    const post = postSchema.safeParse({
      id: m.id,
      image,
      href: m.permalink,
      timestamp: m.timestamp,
    });
    return post.success ? [post.data] : [];
  });
  return posts.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 4);
}

const stateSchema = z.object({
  accessToken: z.string().min(1),
  tokenUpdatedAt: z.number(),
  tokenExpiresAt: z.number(),
  syncedAt: z.number(),
  posts: z.array(postSchema).max(4),
});
type State = z.infer<typeof stateSchema>;

function configuration() {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !token) return null;
  if (!/^\d+$/.test(userId)) throw new Error("instagram_configuration_invalid");
  const version = process.env.INSTAGRAM_API_VERSION || "v25.0";
  if (!/^v\d+\.0$/.test(version)) throw new Error("instagram_configuration_invalid");
  // A new bootstrap token starts a new connection, even when the account ID is unchanged.
  const digest = createHash("sha256").update(token).digest("hex").slice(0, 24);
  return { userId, token, version, key: `holisticvn:instagram:${userId}:${digest}` };
}

async function readState(key: string): Promise<State | null> {
  const value = await redisCommand(["GET", key]);
  return typeof value === "string" ? stateSchema.parse(JSON.parse(value)) : null;
}

async function writeState(key: string, state: State) {
  await redisCommand(["SET", key, JSON.stringify(state), "EX", String(STATE_TTL)]);
}

async function instagramRequest(url: URL, token: string) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  // Never include provider response bodies, URLs or credentials in errors/logs.
  if (!response.ok) throw new Error("instagram_request_failed");
  return response.json();
}

export async function syncInstagramFeed(): Promise<boolean> {
  const config = configuration();
  if (!config) return false;
  const lockKey = `${config.key}:lock`;
  const lockId = randomUUID();
  const locked = await redisCommand(["SET", lockKey, lockId, "NX", "EX", "45"]);
  if (locked !== "OK") return false;
  try {
    const now = Date.now();
    let state = (await readState(config.key)) || {
      accessToken: config.token,
      tokenUpdatedAt: now,
      tokenExpiresAt: now + 60 * 24 * HOUR,
      syncedAt: 0,
      posts: [],
    };
    if (now >= state.tokenExpiresAt) throw new Error("instagram_reconnect_required");
    if (now - state.tokenUpdatedAt >= WEEK) {
      const url = new URL("https://graph.instagram.com/refresh_access_token");
      url.searchParams.set("grant_type", "ig_refresh_token");
      // This endpoint requires the token as a query parameter per Meta's reference.
      url.searchParams.set("access_token", state.accessToken);
      const refreshed = z
        .object({ access_token: z.string().min(1), expires_in: z.number().positive() })
        .parse(await instagramRequest(url, state.accessToken));
      state = {
        ...state,
        accessToken: refreshed.access_token,
        tokenUpdatedAt: now,
        tokenExpiresAt: now + refreshed.expires_in * 1000,
      };
      // Persist the refreshed credential even if the following media request fails.
      await writeState(config.key, state);
    }
    const url = new URL(`https://graph.instagram.com/${config.version}/${config.userId}/media`);
    url.searchParams.set(
      "fields",
      "id,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}",
    );
    url.searchParams.set("limit", "25");
    const posts = parseInstagramPosts(await instagramRequest(url, state.accessToken));
    await writeState(config.key, { ...state, posts, syncedAt: now });
    return true;
  } finally {
    await redisCommand([
      "EVAL",
      "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end return 0",
      "1",
      lockKey,
      lockId,
    ]);
  }
}

/** null = not connected; [] = connected but no displayable posts. Secrets stay server-side. */
export async function getInstagramPosts(): Promise<InstagramPost[] | null> {
  let previous: State | null = null;
  try {
    const config = configuration();
    if (!config) return null;
    previous = await readState(config.key);
    // Refresh only through the scheduled route; homepage reads never call Meta.
    // Signed CDN URLs are temporary; don't render an indefinitely stale feed.
    return previous && Date.now() - previous.syncedAt < 48 * HOUR ? previous.posts : [];
  } catch {
    console.warn("Instagram feed unavailable; check the connection and scheduled sync.");
    return previous && Date.now() - previous.syncedAt < 48 * HOUR ? previous.posts : [];
  }
}
