import { createHash } from "node:crypto";
import { redisCommand } from "@/lib/redis";

const windowSeconds = 3600;
const phoneLimit = 5;
const globalLimit = 60;
const local = new Map<string, { count: number; expires: number }>();

// All checks and increments share one atomic operation across serverless workers.
const script = `
local individual = tonumber(redis.call('GET', KEYS[1]) or '0')
local total = tonumber(redis.call('GET', KEYS[2]) or '0')
if individual >= tonumber(ARGV[1]) or total >= tonumber(ARGV[2]) then return 0 end
for i = 1, 2 do
  local count = redis.call('INCR', KEYS[i])
  if count == 1 then redis.call('EXPIRE', KEYS[i], ARGV[3]) end
end
return 1`;

export async function checkLeadRateLimit(
  phone: string,
): Promise<"allowed" | "limited" | "unavailable"> {
  // Phone + a global budget also work without trusting caller-supplied IP headers.
  const digits = phone.replace(/\D/g, "").replace(/^84/, "0");
  const key = `holisticvn:leads:phone:${createHash("sha256").update(digits).digest("hex")}`;
  const globalKey = "holisticvn:leads:total";
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const result = await redisCommand([
        "EVAL",
        script,
        "2",
        key,
        globalKey,
        String(phoneLimit),
        String(globalLimit),
        String(windowSeconds),
      ]);
      if (result !== 0 && result !== 1) return "unavailable";
      return result === 1 ? "allowed" : "limited";
    } catch {
      return "unavailable";
    }
  }
  // Local development stays usable; production must have the shared limiter configured.
  if (process.env.NODE_ENV === "production") return "unavailable";
  const now = Date.now();
  for (const [id, entry] of local) if (entry.expires <= now) local.delete(id);
  if (
    (local.get(key)?.count ?? 0) >= phoneLimit ||
    (local.get(globalKey)?.count ?? 0) >= globalLimit
  )
    return "limited";
  for (const id of [key, globalKey]) {
    const entry = local.get(id) ?? { count: 0, expires: now + windowSeconds * 1000 };
    entry.count++;
    local.set(id, entry);
  }
  return "allowed";
}
