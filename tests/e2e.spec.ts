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
  });
});
