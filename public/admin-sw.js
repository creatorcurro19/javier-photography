// Service Worker privado para la App PWA de Administración (/admin)
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Red siempre directa para que consultas, pedidos y catálogo estén siempre en vivo
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith("/admin")) return;

  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          '<!doctype html><html lang="es"><body style="background:#0B0C0E;color:#EBE7DF;font-family:sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center"><div><h1 style="font-size:20px;margin-bottom:8px">Sin conexión</h1><p style="color:#A39E93;font-size:14px">Comprueba tu conexión a internet para consultar la bandeja de entrada.</p></div></body></html>',
          {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        )
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl =
    (event.notification && event.notification.data && event.notification.data.url) ||
    "/admin?tab=inbox";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url.includes("/admin")) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
