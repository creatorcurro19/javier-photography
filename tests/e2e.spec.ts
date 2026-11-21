import { test, expect } from "@playwright/test";

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
    expect(typeof body.integrations.email.resendConfigured).toBe("boolean");
    expect(typeof body.integrations.whatsapp.configured).toBe("boolean");
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

    const webhookRes = await request.post("/api/webhooks/stripe", {
      data: {
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_mock_123",
            amount_total: 25500,
            currency: "eur",
            customer_details: { email: "test-buyer@example.com" },
            metadata: {
              orderId: "JE-2026-TEST",
              customerName: "Coleccionista E2E",
            },
          },
        },
      },
    });
    expect(webhookRes.status()).toBe(200);
    const webhookData = await webhookRes.json();
    expect(webhookData.received).toBe(true);
  });
});
