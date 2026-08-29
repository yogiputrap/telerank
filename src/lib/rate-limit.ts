type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function getClientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'local';
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  if (process.env.NODE_ENV !== 'production') return false;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

export function jsonTooLarge(request: Request, maxBytes = 16_384) {
  const length = Number(request.headers.get('content-length') || 0);
  return Number.isFinite(length) && length > maxBytes;
}
