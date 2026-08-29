import { NextResponse } from 'next/server';

interface CachedBotInfo {
  username: string;
  botName: string;
  description: string;
  avatarUrl: string;
  hasCustomAvatar: boolean;
  timestamp: number;
}

const botCache = new Map<string, CachedBotInfo>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUsername = searchParams.get('username') || '';
  const cleanUsername = rawUsername
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^@/, '')
    .trim()
    .toLowerCase();

  if (!cleanUsername || !/^[a-zA-Z0-9_]{5,32}$/.test(cleanUsername)) {
    return NextResponse.json({ error: 'INVALID_USERNAME' }, { status: 400 });
  }

  // Check cache
  const cached = botCache.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ success: true, data: cached });
  }

  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

  try {
    const res = await fetch(`https://t.me/${cleanUsername}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(4500),
    });

    if (!res.ok) {
      const fallbackData: CachedBotInfo = {
        username: cleanUsername,
        botName: cleanUsername,
        description: '',
        avatarUrl: fallbackAvatar,
        hasCustomAvatar: false,
        timestamp: Date.now(),
      };
      botCache.set(cleanUsername, fallbackData);
      return NextResponse.json({ success: true, data: fallbackData });
    }

    const html = await res.text();

    // 1. Extract Bot Name / Title
    let botName =
      html.match(/<meta\s+property=["\x27]og:title["\x27]\s+content=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    if (!botName) {
      const pageTitle = html.match(/<div class=["\x27]tgme_page_title["\x27][^>]*>([\s\S]*?)<\/div>/i)?.[1];
      botName = pageTitle ? pageTitle.replace(/<[^>]+>/g, '').trim() : '';
    }
    botName = botName
      .replace(/^Telegram:\s*Contact\s*@/i, '')
      .replace(/\s*✔\s*$/, '')
      .trim();

    // Decode basic HTML entities
    botName = botName
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    // 2. Extract Description
    let description =
      html.match(/<meta\s+property=["\x27]og:description["\x27]\s+content=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    if (!description) {
      const pageDesc = html.match(/<div class=["\x27]tgme_page_description["\x27][^>]*>([\s\S]*?)<\/div>/i)?.[1];
      description = pageDesc ? pageDesc.replace(/<[^>]+>/g, '').trim() : '';
    }
    description = description
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    // Filter generic Telegram boilerplate descriptions
    const lowerDesc = description.toLowerCase();
    const isGenericDesc =
      !description ||
      lowerDesc.startsWith('you can contact @') ||
      lowerDesc.startsWith('telegram is a cloud-based') ||
      lowerDesc.startsWith('if you have telegram');

    if (isGenericDesc) {
      description = '';
    } else if (description.length > 150) {
      description = description.slice(0, 147) + '...';
    }

    // 3. Extract Avatar Image URL
    let avatarUrl =
      html.match(/<meta\s+property=["\x27]og:image["\x27]\s+content=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    if (!avatarUrl) {
      avatarUrl = html.match(/<img class=["\x27]tgme_page_photo_image["\x27][^>]*src=["\x27]([^"\x27]+)["\x27]/i)?.[1] || '';
    }

    const isDefaultLogo =
      !avatarUrl ||
      avatarUrl.includes('t_logo.png') ||
      avatarUrl.includes('t_logo_2x.png') ||
      avatarUrl.includes('telegram.org/img');

    const hasCustomAvatar = !isDefaultLogo && avatarUrl.startsWith('http');
    const finalAvatar = hasCustomAvatar ? avatarUrl : fallbackAvatar;

    const data: CachedBotInfo = {
      username: cleanUsername,
      botName: botName || cleanUsername,
      description,
      avatarUrl: finalAvatar,
      hasCustomAvatar,
      timestamp: Date.now(),
    };

    botCache.set(cleanUsername, data);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Failed to fetch telegram bot profile for', cleanUsername, err);
    const fallbackData: CachedBotInfo = {
      username: cleanUsername,
      botName: cleanUsername,
      description: '',
      avatarUrl: fallbackAvatar,
      hasCustomAvatar: false,
      timestamp: Date.now(),
    };
    return NextResponse.json({ success: true, data: fallbackData });
  }
}
