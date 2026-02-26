import { LRUCache } from "lru-cache";

interface BlockedIP {
  reason: string;
  blockedAt: Date;
  expiresAt: Date | null; // null = permanent
  blockedBy: "manual" | "auto";
}

// In-memory blocklist
const blocklist = new LRUCache<string, BlockedIP>({
  max: 10000,
  ttl: 24 * 60 * 60 * 1000, // Auto-expire after 24h by default
});

// Hardcoded permanent blocks
const PERMANENT_BLOCKLIST = new Set<string>([]);

export function isIPBlocked(ip: string): BlockedIP | null {
  // Check permanent blocklist
  if (PERMANENT_BLOCKLIST.has(ip)) {
    return {
      reason: "Permanently blocked",
      blockedAt: new Date(0),
      expiresAt: null,
      blockedBy: "manual",
    };
  }

  const blocked = blocklist.get(ip);
  if (!blocked) return null;

  // Check if block has expired
  if (blocked.expiresAt && blocked.expiresAt < new Date()) {
    blocklist.delete(ip);
    return null;
  }

  return blocked;
}

export function blockIP(
  ip: string,
  reason: string,
  durationMs: number | null = 24 * 60 * 60 * 1000,
  blockedBy: "manual" | "auto" = "auto",
): void {
  blocklist.set(ip, {
    reason,
    blockedAt: new Date(),
    expiresAt: durationMs ? new Date(Date.now() + durationMs) : null,
    blockedBy,
  });

  console.warn(`[SECURITY] IP blocked: ${ip} - Reason: ${reason}`);
}

export function unblockIP(ip: string): boolean {
  return blocklist.delete(ip);
}

// Auto-block after too many 429s or suspicious activity
const suspiciousActivity = new LRUCache<string, number>({
  max: 10000,
  ttl: 60 * 60 * 1000, // 1 hour window
});

export function recordSuspiciousActivity(ip: string): void {
  const count = (suspiciousActivity.get(ip) || 0) + 1;
  suspiciousActivity.set(ip, count);

  // Auto-block after 10 suspicious activities in an hour
  if (count >= 10) {
    blockIP(
      ip,
      "Automated block: excessive suspicious activity",
      6 * 60 * 60 * 1000,
    );
    suspiciousActivity.delete(ip);
  }
}
