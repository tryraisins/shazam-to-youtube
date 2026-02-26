import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "./rateLimit";

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limitType: keyof typeof RATE_LIMITS = "api",
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Use IP for identifier
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const identifier = `${limitType}:${ip}`;

    const config = RATE_LIMITS[limitType];
    const result = checkRateLimit(identifier, config);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const response = await handler(req);

    // Add rate limit headers to response
    response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));

    return response;
  };
}
