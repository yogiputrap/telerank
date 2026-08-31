type Bucket = { count: number; resetAt: number };

const MAX_BUCKETS = 5000;
const buckets = new Map<string, Bucket>();
let lastCleanup = Date.now();

function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanup < 60_000 && buckets.size < MAX_BUCKETS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
  // If still above limit, delete oldest entries (FIFO/LRU)
  if (buckets.size >= MAX_BUCKETS) {
    const keysToDelete = Array.from(buckets.keys()).slice(0, 500);
    for (const k of keysToDelete) buckets.delete(k);
  }
}

export function getClientKey(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Split and get the client IP (first item in the list)
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[0];
  }

  return 'unknown-client';
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function jsonTooLarge(request: Request, maxBytes = 16_384): boolean {
  const length = Number(request.headers.get('content-length') || 0);
  return Number.isFinite(length) && length > maxBytes;
}
