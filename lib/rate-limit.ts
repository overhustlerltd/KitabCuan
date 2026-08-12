/**
 * In-memory per-IP rate limiter. Resets on server restart / serverless cold
 * start and isn't shared across instances — good enough as a basic abuse
 * guard for this project's scale. For real production traffic, swap this
 * for a shared store (e.g. Upstash Redis) or a platform-level firewall rule.
 */
const requestLog = new Map<string, number[]>();

export function isRateLimited(identifier: string, maxRequests: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(identifier) ?? [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  recent.push(now);
  requestLog.set(identifier, recent);

  // Opportunistic cleanup so the map doesn't grow unbounded over a long-running process.
  if (requestLog.size > 5000) {
    requestLog.forEach((value, key) => {
      if (value.every((t) => now - t > windowMs)) requestLog.delete(key);
    });
  }

  return recent.length > maxRequests;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
