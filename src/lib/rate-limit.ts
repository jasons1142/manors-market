import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const registerRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "register",
});

export const checkoutRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "checkout",
});

export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "upload",
});

export function getIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous"
  );
}