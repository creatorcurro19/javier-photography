import { createHmac } from "crypto";
import { test, expect } from "@playwright/test";
import { E2E_WEBHOOK_SECRET } from "../playwright.config";

test.describe("Javier Espinosa Photography — Seguridad, APIs y SEO", () => {
  test("GET /api/health devuelve estado de integraciones sin exponer secretos", async ({
    request,
  }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe("healthy");
    expect(typeof body.integrations.stripe.configured).toBe("boolean");
    expect(typeof body.integrations.stripe.webhookConfigured).toBe("boolean");
    expect(typeof body.integrations.stripe.flagActive).toBe("boolean");
    expect(typeof body.integrations.stripe.ready).toBe("boolean");
    expect(typeof body.integrations.stripe.adaptivePricingEnabled).toBe("boolean");
    expect(typeof body.integrations.stripe.automaticTaxEnabled).toBe("boolean");
    expect(typeof body.integrations.email.resendConfigured).toBe("boolean");
    expect(typeof body.integrations.whatsapp.configured).toBe("boolean");
    expect(typeof body.integrations.mobilePush.ntfyConfigured).toBe("boolean");
    expect(typeof body.integrations.mobilePush.telegramConfigured).toBe("boolean");
    expect(typeof body.integrations.mobilePush.ready).toBe("boolean");
  });

  test("POST /api/checkout recalcula precios en servidor e impide manipulación de importes", async ({
    request,
  }) => {
    // Intento de ataque: enviar unitPrice: 1 € y totalPrice: 1 € para un Formato Galería con marco (480 + 190 = 670 €)
    const tamperedPayload = {
      orderId: "JE-2026-1234",
      customer: {
        nombre: "Coleccionista Test",
        email: "coleccionista@example.com",
        telefono: "600000000",
        direccion: "Calle Alcalá 1",
        ciudad: "Madrid",
        codigoPostal: "28014",
        pais: "España",
      },
      items: [
        {
          id: "cotorra-en-reposo-galeria-framed",
          photoId: "fn-01",
          slug: "cotorra-en-reposo",
          title: "Cotorra en Reposo",
          image: "/images/portfolio/fauna-naturaleza/cotorra-en-reposo.jpg",
          category: "fauna-naturaleza",
          format: {
            id: "galeria",
            name: "Manipulado",
            dimensions: "50 × 70 cm",
            imageDimensions: "40 × 60 cm",
            price: 1,
            framePrice: 0,
            editionLimit: 25,
          },
          framed: true,
          quantity: 1,
          unitPrice: 1,
          totalPrice: 1,
        },
      ],
      subtotal: 1,
      createdAt: new Date().toISOString(),
    };

    const res = await request.post("/api/checkout", { data: tamperedPayload });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.orderId).toBe("JE-2026-1234");

    // Obra inexistente debe ser rechazada con 400
    const fakePhotoRes = await request.post("/api/checkout", {
      data: {
        ...tamperedPayload,
        items: [
          {
            ...tamperedPayload.items[0],
            slug: "obra-inventada-inexistente",
            photoId: "xx-999",
            image: "/images/inexistente.jpg",
          },
        ],
      },
    });
    expect(fakePhotoRes.status()).toBe(400);

    // Formato Gran Colección deshabilitado por ISO/resolución debe ser rechazado con 400
    const disabledFormatRes = await request.post("/api/checkout", {
      data: {
        ...tamperedPayload,
        items: [
          {
            ...tamperedPayload.items[0],
            format: { ...tamperedPayload.items[0].format, id: "coleccion" },
          },
        ],
      },
    });
    expect(disabledFormatRes.status()).toBe(400);

    // Obra no comercializable como lámina (prints: false) debe ser rechazada con 400
    const nonPrintableRes = await request.post("/api/checkout", {
      data: {
        ...tamperedPayload,
        items: [
          {
            ...tamperedPayload.items[0],
            slug: "parque-de-trabajo",
            photoId: "cr-01",
            image: "/images/portfolio/coches-rally/parque-de-trabajo.jpg",
            category: "coches-rally",
          },
        ],
      },
    });
    expect(nonPrintableRes.status()).toBe(400);
  });

  test("POST /api/client-gallery valida claves en servidor y rechaza códigos inválidos", async ({
    request,
  }) => {
    const badRes = await request.post("/api/client-gallery", {
      data: { code: "CLAVE-FALSA-999" },
    });
    expect(badRes.status()).toBe(401);

    const okRes = await request.post("/api/client-gallery", {
      data: { code: "RALLY2026" },
    });
    expect(okRes.status()).toBe(200);
    const okData = await okRes.json();
    expect(okData.ok).toBe(true);
    expect(okData.gallery.code).toBe("RALLY2026");
    expect(okData.gallery.photos.length).toBeGreaterThan(0);
  });

  test("Landings SEO de servicios y sitemap XML responden con datos estructurados", async ({
    request,
  }) => {
    const slugs = [
      "fotografo-rally-motorsport",
      "fotografo-arquitectura-espacio-urbano",
      "licencias-fotografia-fauna-naturaleza",
      "copias-fine-art-coleccionismo",
    ];

    for (const slug of slugs) {
      const res = await request.get(`/servicios/${slug}`);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toContain('"@type":"Service"');
      expect(html).toContain('"@type":"FAQPage"');
    }

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const xml = await sitemapRes.text();
    expect(xml).toContain("/servicios/fotografo-rally-motorsport");
    expect(xml).toContain("/servicios/copias-fine-art-coleccionismo");
    expect(xml).toContain("/dossier");

    const imageSitemapRes = await request.get("/image-sitemap.xml");
    expect(imageSitemapRes.status()).toBe(200);
    const imageXml = await imageSitemapRes.text();
    expect(imageXml).toContain("http://www.google.com/schemas/sitemap-image/1.1");
    expect(imageXml).toContain("/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg");
  });

  test("Identidad de autor, índice curatorial de 100 obras y verificación de Google Search Console están presentes en SSR", async ({
    request,
  }) => {
    const homeRes = await request.get("/");
    expect(homeRes.status()).toBe(200);
    const homeHtml = await homeRes.text();
    expect(homeHtml).toContain("google-site-verification");
    expect(homeHtml).toContain('"@type":["Person","Photographer"');
    expect(homeHtml).toContain('"@type":["WebSite","ArtGallery"]');

    const portfolioRes = await request.get("/portfolio");
    expect(portfolioRes.status()).toBe(200);
    const portfolioHtml = await portfolioRes.text();
    // Verifica que obras del final del archivo (más allá de las primeras 24) tengan enlace real en el HTML SSR
    expect(portfolioHtml).toContain("/portfolio/cuervo-canario-ante-las-cumbres");
    expect(portfolioHtml).toContain("/portfolio/frontal-clasico-bmw-e30");
    expect(portfolioHtml).toContain("/portfolio/el-esfuerzo-del-portador");
  });

  test("Generador dinámico OpenGraph /api/og y Webhook de Stripe responden con éxito", async ({
    request,
  }) => {
    const ogRes = await request.get(
      "/api/og?title=Mirada+del+lince+boreal&badge=FAUNA+SALVAJE&subtitle=Sierra+de+Andújar"
    );
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()["content-type"]).toContain("image/png");

    const event = JSON.stringify({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_mock_123",
          payment_status: "paid",
          amount_total: 25500,
          currency: "eur",
          customer_details: { email: "test-buyer@example.com" },
          metadata: {
            orderId: "JE-2026-TEST",
            customerName: "Coleccionista E2E",
          },
        },
      },
    });
    const headers = { "Content-Type": "application/json" };

    // Sin firma: un tercero no puede marcar pedidos como pagados
    const unsignedRes = await request.post("/api/webhooks/stripe", { data: event, headers });
    expect(unsignedRes.status()).toBe(400);

    // Firma falsa
    const forgedRes = await request.post("/api/webhooks/stripe", {
      data: event,
      headers: { ...headers, "Stripe-Signature": `t=${Math.floor(Date.now() / 1000)},v1=${"0".repeat(64)}` },
    });
    expect(forgedRes.status()).toBe(400);

    // Firma válida (secreto de prueba inyectado en playwright.config.ts)
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac("sha256", E2E_WEBHOOK_SECRET).update(`${t}.${event}`).digest("hex");
    const signedRes = await request.post("/api/webhooks/stripe", {
      data: event,
      headers: { ...headers, "Stripe-Signature": `t=${t},v1=${sig}` },
    });
    expect(signedRes.status()).toBe(200);
    expect((await signedRes.json()).received).toBe(true);

    // Eventos diferidos (async_payment_succeeded / async_payment_failed) y deduplicación por event.id
    for (const [idx, type] of [
      "checkout.session.async_payment_succeeded",
      "checkout.session.async_payment_failed",
    ].entries()) {
      const asyncEvent = JSON.stringify({
        id: `evt_e2e_async_${idx}`,
        type,
        data: {
          object: {
            id: `cs_test_mock_async_${idx}`,
            payment_status: type.endsWith("succeeded") ? "paid" : "unpaid",
            amount_total: 21700,
            currency: "eur",
            customer_details: { email: "test-buyer@example.com" },
            metadata: {
              orderId: `JE-2026-ASYNC-${idx}`,
              customerName: "Coleccionista UE",
              lang: "en",
            },
          },
        },
      });
      const asyncSig = createHmac("sha256", E2E_WEBHOOK_SECRET)
        .update(`${t}.${asyncEvent}`)
        .digest("hex");
      const asyncRes = await request.post("/api/webhooks/stripe", {
        data: asyncEvent,
        headers: { ...headers, "Stripe-Signature": `t=${t},v1=${asyncSig}` },
      });
      expect(asyncRes.status()).toBe(200);
      expect((await asyncRes.json()).received).toBe(true);

      // Reenvío del mismo event.id debe responder duplicate: true
      const dupRes = await request.post("/api/webhooks/stripe", {
        data: asyncEvent,
        headers: { ...headers, "Stripe-Signature": `t=${t},v1=${asyncSig}` },
      });
      expect(dupRes.status()).toBe(200);
      expect((await dupRes.json()).duplicate).toBe(true);
    }
  });

  test("Tipo de cambio /api/fx, estimación USD solo en /en y checkout bilingüe", async ({
    request,
  }) => {
    const fxRes = await request.get("/api/fx");
    expect(fxRes.status()).toBe(200);
    const fx = await fxRes.json();
    expect(fx.base).toBe("EUR");
    expect(fx.quote).toBe("USD");
    expect(typeof fx.rate).toBe("number");
    expect(fx.rate).toBeGreaterThan(0.5);
    expect(fx.rate).toBeLessThan(2);

    const printsEs = await request.get("/prints");
    expect(printsEs.status()).toBe(200);
    const printsEsHtml = await printsEs.text();
    expect(printsEsHtml).toContain("€");
    expect(printsEsHtml).not.toContain("~$");

    const printsEn = await request.get("/en/prints");
    expect(printsEn.status()).toBe(200);
    const printsEnHtml = await printsEn.text();
    expect(printsEnHtml).toContain("€");
    expect(printsEnHtml).toContain("~$");
    expect(printsEnHtml).toContain("USD");
    expect(printsEnHtml).toContain("€48");

    const workEs = await request.get("/portfolio/mirada-del-lince-boreal");
    expect(workEs.status()).toBe(200);
    expect(await workEs.text()).not.toContain("~$");

    const workEn = await request.get("/en/portfolio/mirada-del-lince-boreal");
    expect(workEn.status()).toBe(200);
    const workEnHtml = await workEn.text();
    expect(workEnHtml).toContain("~$");
    expect(workEnHtml).toContain("USD");
    expect(workEnHtml).toContain("View to scale on wall");
    expect(workEnHtml).toContain("pinterest.com/pin/create/button/");
    expect(workEnHtml).toContain('"value":"48.00"');
    expect(workEnHtml).toContain('"value":"32.00"');
    expect(workEnHtml).toContain('"value":"18.00"');

    // Obra con Gran Colección deshabilitado por ISO 6400: Schema debe publicar 2 ofertas y mostrar motivo
    const limitedWorkEn = await request.get("/en/portfolio/cotorra-en-reposo");
    expect(limitedWorkEn.status()).toBe(200);
    const limitedHtml = await limitedWorkEn.text();
    expect(limitedHtml).toContain('"offerCount":"2"');
    expect(limitedHtml).toContain("ISO 6400");

    // Dossier bilingüe sin rango duplicado Ed. 25-25 y con USD
    const dossierEn = await request.get("/en/dossier");
    expect(dossierEn.status()).toBe(200);
    const dossierHtml = await dossierEn.text();
    expect(dossierHtml).not.toContain("25–25");
    expect(dossierHtml).toContain("USD");

    const checkoutEnRes = await request.post("/api/checkout", {
      data: {
        lang: "en",
        orderId: "JE-2026-8888",
        customer: {
          nombre: "US Collector",
          email: "collector@example.com",
          telefono: "+1 555 0100",
          direccion: "350 5th Ave",
          ciudad: "New York",
          codigoPostal: "10118",
          pais: "United States",
        },
        shippingZone: "internacional",
        items: [
          {
            id: "mirada-del-lince-boreal-galeria-print",
            photoId: "fn-02",
            slug: "mirada-del-lince-boreal",
            title: "Mirada del lince boreal",
            image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
            category: "fauna-naturaleza",
            format: {
              id: "galeria",
              name: "Gallery Format",
              dimensions: "50 × 70 cm",
              imageDimensions: "40 × 60 cm",
              price: 185,
              framePrice: 0,
              editionLimit: 25,
            },
            framed: false,
            quantity: 1,
            unitPrice: 185,
            totalPrice: 185,
          },
        ],
        subtotal: 185,
        shippingCost: 28,
        total: 213,
      },
    });
    expect(checkoutEnRes.status()).toBe(200);
    const checkoutEn = await checkoutEnRes.json();
    expect(checkoutEn.ok).toBe(true);
    expect(checkoutEn.orderId).toBe("JE-2026-8888");

    const checkoutEuRes = await request.post("/api/checkout", {
      data: {
        lang: "en",
        orderId: "JE-2026-8889",
        customer: {
          nombre: "EU Collector",
          email: "eu@example.com",
          telefono: "+33 600000000",
          direccion: "10 Rue de Rivoli",
          ciudad: "Paris",
          codigoPostal: "75001",
          pais: "France",
        },
        shippingZone: "europa",
        items: [
          {
            id: "mirada-del-lince-boreal-galeria-print",
            photoId: "fn-02",
            slug: "mirada-del-lince-boreal",
            title: "Mirada del lince boreal",
            image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
            category: "fauna-naturaleza",
            format: {
              id: "galeria",
              name: "Gallery Format",
              dimensions: "50 × 70 cm",
              imageDimensions: "40 × 60 cm",
              price: 185,
              framePrice: 0,
              editionLimit: 25,
            },
            framed: false,
            quantity: 1,
            unitPrice: 185,
            totalPrice: 185,
          },
        ],
        subtotal: 185,
        shippingCost: 32,
        total: 217,
      },
    });
    expect(checkoutEuRes.status()).toBe(200);
    expect((await checkoutEuRes.json()).ok).toBe(true);
  });

  test("Versión App PWA de /admin y endpoint protegido de prueba push", async ({
    request,
  }) => {
    const manifestRes = await request.get("/admin/manifest.webmanifest");
    expect(manifestRes.status()).toBe(200);
    const manifest = await manifestRes.json();
    expect(manifest.id).toBe("/admin");
    expect(manifest.start_url).toBe("/admin?tab=inbox");
    expect(manifest.display).toBe("standalone");
    expect(manifest.short_name).toBe("J.E. Admin");

    const swRes = await request.get("/admin-sw.js");
    expect(swRes.status()).toBe(200);
    const swText = await swRes.text();
    expect(swText).toContain("/admin?tab=inbox");

    const adminRes = await request.get("/admin?tab=inbox");
    expect(adminRes.status()).toBe(200);
    const adminHtml = await adminRes.text();
    expect(adminHtml).toContain("/admin/manifest.webmanifest");
    expect(adminHtml).toContain("mobile-web-app-capable");
    expect(adminHtml).toContain("apple-mobile-web-app-title");
    expect(adminHtml).toContain("apple-mobile-web-app-status-bar-style");
    expect(adminHtml).toContain("J.E. Admin");
    expect(adminHtml).not.toContain("<footer");

    const unauthTest = await request.post("/api/admin/notify-test");
    expect(unauthTest.status()).toBe(401);

    const unauthTgDetect = await request.post("/api/admin/telegram-detect", {
      data: { token: "123456:test" },
    });
    expect(unauthTgDetect.status()).toBe(401);
  });
});
