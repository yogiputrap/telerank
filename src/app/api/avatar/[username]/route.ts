import { NextResponse } from 'next/server';

interface CachedAvatar {
  buffer: Buffer;
  contentType: string;
  expiresAt: number;
}

const MAX_AVATAR_CACHE = 500;
const avatarCache = new Map<string, CachedAvatar>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getDicebearUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cleanUsername = String(username || '')
    .replace(/^@/, '')
    .toLowerCase()
    .trim();

  if (!cleanUsername) {
    return NextResponse.redirect(getDicebearUrl('bot'), 307);
  }

  // Check in-memory cache
  const cached = avatarCache.get(cleanUsername);
  if (cached && Date.now() < cached.expiresAt) {
    return new Response(new Uint8Array(cached.buffer), {
      status: 200,
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  try {
    const tmeRes = await fetch(`https://t.me/${cleanUsername}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(4500),
    });

    if (!tmeRes.ok) {
      return NextResponse.redirect(getDicebearUrl(cleanUsername), 307);
    }

    const html = await tmeRes.text();
    let avatarUrl =
      html.match(/<meta\s+property=["\x27]og:image["\x27]\s+content=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    if (!avatarUrl) {
      avatarUrl =
        html.match(/<img class=["\x27]tgme_page_photo_image["\x27][^>]*src=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    }

    const isDefaultLogo =
      !avatarUrl ||
      avatarUrl.includes('t_logo.png') ||
      avatarUrl.includes('t_logo_2x.png') ||
      avatarUrl.includes('telegram.org/img');

    if (!isDefaultLogo && avatarUrl.startsWith('http')) {
      const imgRes = await fetch(avatarUrl, {
        signal: AbortSignal.timeout(4500),
      });

      if (imgRes.ok) {
        const arrayBuf = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

        if (avatarCache.size >= MAX_AVATAR_CACHE) {
          const oldestKey = avatarCache.keys().next().value;
          if (oldestKey) avatarCache.delete(oldestKey);
        }

        avatarCache.set(cleanUsername, {
          buffer,
          contentType,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });

        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      }
    }

    return NextResponse.redirect(getDicebearUrl(cleanUsername), 307);
  } catch {
    return NextResponse.redirect(getDicebearUrl(cleanUsername), 307);
  }
}
