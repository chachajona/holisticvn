// Only short-lived rate counters belong here, never form contents.
export async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("redis_unconfigured");
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error("redis_unavailable");
  const data = await response.json();
  if (data.error || !("result" in data)) throw new Error("redis_command_failed");
  return data.result;
}
