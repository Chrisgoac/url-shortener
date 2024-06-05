import type { APIRoute } from "astro";
import { ShortUrl, db, eq } from "astro:db";

export const POST: APIRoute = async ({ request }) => {

  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#]+\.[^\s/$.?#]{2,}$/i;

  if (request.headers.get('Content-Type') !== 'application/json') {
    return new Response('Content-Type must be application/json', { status: 400 });
  }

  const body = await request.json();
  const url: string = body.url;
  const isCustom = body.isCustom;
  const userId = body.userId;

  if (!url) {
    return new Response(null, { status: 400, statusText: 'URL is required' });
  }

  if (!urlRegex.test(url)) {
    return new Response(null, { status: 400, statusText: 'Invalid URL' });
  }

  let id: string = '';

  if (isCustom) {
    const customUrl = body.customUrl;
    if (!customUrl) {
      return new Response(null, { status: 400, statusText: 'Custom URL is required' });
    }
    id = customUrl;
  } else {
    let unique = false;
    while (!unique) {
      id = Math.random().toString(36).substring(2, 8);
      const urlExists = await db.select().from(ShortUrl).where(eq(ShortUrl.code, id));
      if (urlExists.length === 0) {
        unique = true;
      }
    }
  }

  const newUrl = new URL(request.url)

  const shortUrl = `${newUrl.origin}/${id}`;

  await db.insert(ShortUrl).values({
    user_id: userId ? userId : null,
    custom: isCustom,
    code: id,
    url: url,
  });

  return new Response(JSON.stringify({ shortUrl: shortUrl }), { status: 200 });
};
