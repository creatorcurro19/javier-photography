import "server-only";
import { SITE_URL } from "@/lib/metadata";

const INDEXNOW_KEY = "b8e4f9a2c1d64e7a9b3c5d8e1f2a4b6c";

/**
 * Notifica de forma asíncrona (no bloqueante) a Google WebSub y a IndexNow
 * cada vez que se publican o actualizan obras desde el panel privado.
 */
export async function notifySearchEngines(relativePaths: string[]): Promise<void> {
  try {
    const base = SITE_URL.replace(/\/$/, "");
    const host = new URL(base).host;
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return;
    }

    const urlSet = new Set<string>([
      base,
      `${base}/portfolio`,
      `${base}/prints`,
      `${base}/sitemap.xml`,
      `${base}/image-sitemap.xml`,
      `${base}/feed.xml`,
    ]);

    for (const rel of relativePaths) {
      if (!rel) continue;
      const normalized = rel.startsWith("/") ? rel : `/${rel}`;
      urlSet.add(`${base}${normalized}`);
    }

    const urlList = Array.from(urlSet).slice(0, 500);
    const signal = AbortSignal.timeout(4000);

    const indexNowReq = fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal,
    });

    const webSubRequests = [
      `${base}/feed.xml`,
      `${base}/sitemap.xml`,
      `${base}/image-sitemap.xml`,
    ].map((feedUrl) =>
      fetch("https://pubsubhubbub.appspot.com/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "hub.mode": "publish",
          "hub.url": feedUrl,
        }).toString(),
        signal,
      })
    );

    await Promise.allSettled([indexNowReq, ...webSubRequests]);
  } catch {
    // Silencioso: nunca bloquea la respuesta del panel de administración
  }
}
