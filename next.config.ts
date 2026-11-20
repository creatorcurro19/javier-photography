import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
    {
        "source": "/portfolio/posado-en-la-rama-fn-1",
        "destination": "/portfolio/cotorra-en-reposo",
        "permanent": true
    },
    {
        "source": "/portfolio/vuelo-rasante-fn-2",
        "destination": "/portfolio/plumaje-esmeralda",
        "permanent": true
    },
    {
        "source": "/portfolio/garza-blanca-al-sol-fn-3",
        "destination": "/portfolio/garza-blanca-al-sol",
        "permanent": true
    },
    {
        "source": "/portfolio/mirada-del-lince-boreal-fn-4",
        "destination": "/portfolio/mirada-del-lince-boreal",
        "permanent": true
    },
    {
        "source": "/portfolio/contemplacion-en-el-limite-fn-5",
        "destination": "/portfolio/vigias-del-risco",
        "permanent": true
    },
    {
        "source": "/portfolio/perfil-en-el-sotobosque-fn-6",
        "destination": "/portfolio/descenso-en-la-roca",
        "permanent": true
    },
    {
        "source": "/portfolio/atencion-en-la-maleza-fn-7",
        "destination": "/portfolio/cabras-monteses-en-la-pena",
        "permanent": true
    },
    {
        "source": "/portfolio/el-paso-del-lobo-fn-8",
        "destination": "/portfolio/el-paso-del-lobo",
        "permanent": true
    },
    {
        "source": "/portfolio/curva-en-la-cresta-pd-1",
        "destination": "/portfolio/palmeras-en-el-ocaso-atlantico",
        "permanent": true
    },
    {
        "source": "/portfolio/linea-de-asfalto-en-la-penumbra-pd-2",
        "destination": "/portfolio/cumbre-nevada-al-alba",
        "permanent": true
    },
    {
        "source": "/portfolio/paso-estrecho-pd-3",
        "destination": "/portfolio/pasarela-junto-al-mar",
        "permanent": true
    },
    {
        "source": "/portfolio/serenidad-campestre-pd-4",
        "destination": "/portfolio/acantilados-al-atardecer",
        "permanent": true
    },
    {
        "source": "/portfolio/cielo-y-relieve-pd-5",
        "destination": "/portfolio/ave-del-paraiso-al-sol",
        "permanent": true
    },
    {
        "source": "/portfolio/ribera-y-silencio-pd-6",
        "destination": "/portfolio/reflejo-solar-en-la-orilla",
        "permanent": true
    },
    {
        "source": "/portfolio/bruma-en-el-barranco-pd-7",
        "destination": "/portfolio/surcos-del-viento-en-la-arena",
        "permanent": true
    },
    {
        "source": "/portfolio/horizonte-y-nubosidad-pd-8",
        "destination": "/portfolio/murallas-de-caliza",
        "permanent": true
    },
    {
        "source": "/portfolio/salida-de-asistencia-cr-1",
        "destination": "/portfolio/parque-de-trabajo",
        "permanent": true
    },
    {
        "source": "/portfolio/curva-en-apoyo-cr-2",
        "destination": "/portfolio/optica-clasica-en-el-box",
        "permanent": true
    },
    {
        "source": "/portfolio/aceleracion-plena-cr-3",
        "destination": "/portfolio/preparacion-en-paddock",
        "permanent": true
    },
    {
        "source": "/portfolio/clasico-a-tres-ruedas-cr-4",
        "destination": "/portfolio/clasico-a-tres-ruedas",
        "permanent": true
    },
    {
        "source": "/portfolio/paso-en-horquilla-cr-5",
        "destination": "/portfolio/rotulacion-de-competicion",
        "permanent": true
    },
    {
        "source": "/portfolio/estabilidad-al-limite-cr-6",
        "destination": "/portfolio/clasico-en-exhibicion",
        "permanent": true
    },
    {
        "source": "/portfolio/trazada-del-golf-mk1-cr-7",
        "destination": "/portfolio/trazada-del-golf-mk1",
        "permanent": true
    },
    {
        "source": "/portfolio/frenada-en-horquilla-cr-8",
        "destination": "/portfolio/frenada-en-horquilla",
        "permanent": true
    },
    {
        "source": "/portfolio/firme-secundario-cr-9",
        "destination": "/portfolio/habitaculo-de-pilotaje",
        "permanent": true
    },
    {
        "source": "/portfolio/encuadre-en-pendiente-cr-10",
        "destination": "/portfolio/notas-sobre-el-capo",
        "permanent": true
    },
    {
        "source": "/portfolio/verticalidad-y-trazada-cr-11",
        "destination": "/portfolio/leyenda-con-librea-martini",
        "permanent": true
    },
    {
        "source": "/portfolio/frenada-y-deriva-cr-12",
        "destination": "/portfolio/apoyo-en-el-cruce",
        "permanent": true
    },
    {
        "source": "/portfolio/trazada-en-el-tramo-humedo-cr-13",
        "destination": "/portfolio/cruzada-sobre-el-asfalto",
        "permanent": true
    },
    {
        "source": "/portfolio/compresion-a-600mm-cr-14",
        "destination": "/portfolio/rueda-en-el-aire",
        "permanent": true
    },
    {
        "source": "/portfolio/volumenes-y-sombras-au-1",
        "destination": "/portfolio/farola-y-azulejeria-nocturna",
        "permanent": true
    },
    {
        "source": "/portfolio/geometria-y-fugas-au-2",
        "destination": "/portfolio/paseo-nocturno-bajo-las-farolas",
        "permanent": true
    },
    {
        "source": "/portfolio/estructura-y-reticula-au-3",
        "destination": "/portfolio/ventanas-tomadas-por-el-bosque",
        "permanent": true
    },
    {
        "source": "/portfolio/diagonales-en-la-fachada-au-4",
        "destination": "/portfolio/tunel-de-laurisilva-en-la-bruma",
        "permanent": true
    },
    {
        "source": "/portfolio/plano-elevado-au-5",
        "destination": "/portfolio/luz-entre-la-niebla-del-monte",
        "permanent": true
    },
    {
        "source": "/portfolio/esquinas-de-hormigon-au-6",
        "destination": "/portfolio/celosia-de-hierro-y-otono",
        "permanent": true
    },
    {
        "source": "/portfolio/luces-en-la-penumbra-urbana-au-7",
        "destination": "/portfolio/luna-creciente-sobre-el-paseo",
        "permanent": true
    },
    {
        "source": "/portfolio/muelle-al-alba-vc-1",
        "destination": "/portfolio/fruteria-de-barrio",
        "permanent": true
    },
    {
        "source": "/portfolio/gaviotas-en-la-baranda-vc-2",
        "destination": "/portfolio/la-espera-en-la-calleja",
        "permanent": true
    },
    {
        "source": "/portfolio/noche-en-la-juderia-vc-3",
        "destination": "/portfolio/devocion-ante-el-retablo",
        "permanent": true
    },
    {
        "source": "/portfolio/calleja-en-pendiente-vc-4",
        "destination": "/portfolio/procesion-y-fuegos-nocturnos",
        "permanent": true
    },
    {
        "source": "/portfolio/contraluz-en-el-pasaje-vc-5",
        "destination": "/portfolio/humo-y-atardecer-en-la-plaza",
        "permanent": true
    },
    {
        "source": "/portfolio/cisne-en-el-estanque-fn-11",
        "destination": "/portfolio/cisne-en-el-estanque",
        "permanent": true
    },
    {
        "source": "/portfolio/carbonero-en-la-niebla-fn-12",
        "destination": "/portfolio/carbonero-en-la-niebla",
        "permanent": true
    },
    {
        "source": "/portfolio/ciguena-entre-la-hierba-fn-13",
        "destination": "/portfolio/ciguena-entre-la-hierba",
        "permanent": true
    },
    {
        "source": "/portfolio/artesano-en-el-callejon-textil-vc-9",
        "destination": "/portfolio/artesano-en-el-callejon-textil",
        "permanent": true
    },
    {
        "source": "/portfolio/color-y-muros-vc-10",
        "destination": "/portfolio/rana-en-la-corriente",
        "permanent": true
    },
    {
        "source": "/portfolio/almuerzo-en-la-medina-vc-11",
        "destination": "/portfolio/almuerzo-en-la-medina",
        "permanent": true
    },
    {
        "source": "/portfolio/majestad-en-la-dehesa-fn-9",
        "destination": "/portfolio/majestad-en-la-dehesa",
        "permanent": true
    },
    {
        "source": "/portfolio/perfil-del-venado-fn-10",
        "destination": "/portfolio/perfil-del-venado",
        "permanent": true
    },
    {
        "source": "/portfolio/siluetas-en-la-cresta-vc-14",
        "destination": "/portfolio/caminante-a-contraluz",
        "permanent": true
    },
    {
        "source": "/portfolio/paseo-al-atardecer-vc-15",
        "destination": "/portfolio/secadero-de-pimientos-en-la-vera",
        "permanent": true
    },
    {
        "source": "/portfolio/columnata-de-la-madrasa-au-8",
        "destination": "/portfolio/columnata-de-la-madrasa",
        "permanent": true
    },
    {
        "source": "/portfolio/detalle-en-la-tela-vc-17",
        "destination": "/portfolio/macro-de-saltamontes",
        "permanent": true
    },
    {
        "source": "/portfolio/paso-bajo-los-arcos-vc-18",
        "destination": "/portfolio/farola-y-sombra-en-la-cal",
        "permanent": true
    },
    {
        "source": "/portfolio/plaza-y-concurrencia-vc-19",
        "destination": "/portfolio/calleja-entre-muros-de-piedra",
        "permanent": true
    },
    {
        "source": "/portfolio/conversacion-en-la-acera-vc-20",
        "destination": "/portfolio/perspectiva-hacia-el-campanario",
        "permanent": true
    },
    {
        "source": "/portfolio/luz-en-el-rincon-vc-21",
        "destination": "/portfolio/dintel-de-granito-y-madera",
        "permanent": true
    },
    {
        "source": "/portfolio/cesteria-tradicional-vc-22",
        "destination": "/portfolio/rincon-de-alfareria-y-piedra",
        "permanent": true
    },
    {
        "source": "/portfolio/detalle-de-forja-vc-23",
        "destination": "/portfolio/entramados-de-villanueva-de-la-vera",
        "permanent": true
    },
    {
        "source": "/portfolio/esperando-el-te-vc-24",
        "destination": "/portfolio/tarde-dorada-en-la-vera",
        "permanent": true
    },
    {
        "source": "/portfolio/retrato-en-la-penumbra-vc-25",
        "destination": "/portfolio/el-puesto-de-especias-en-el-zoco",
        "permanent": true
    },
    {
        "source": "/portfolio/estratos-volcanicos-junto-al-mar-pd-9",
        "destination": "/portfolio/estratos-volcanicos-junto-al-mar",
        "permanent": true
    },
    {
        "source": "/portfolio/cruce-de-calles-vc-27",
        "destination": "/portfolio/aleros-convergentes",
        "permanent": true
    },
    {
        "source": "/portfolio/luz-en-el-umbral-vc-28",
        "destination": "/portfolio/soportal-de-vigas-hacia-la-fiesta",
        "permanent": true
    },
    {
        "source": "/portfolio/el-reposo-del-anciano-vc-29",
        "destination": "/portfolio/geometria-del-zellij-y-el-arco",
        "permanent": true
    },
    {
        "source": "/portfolio/vendedora-de-especias-vc-30",
        "destination": "/portfolio/calle-real-engalanada",
        "permanent": true
    },
    {
        "source": "/portfolio/textura-de-los-sacos-vc-31",
        "destination": "/portfolio/ristras-en-la-fachada-verata",
        "permanent": true
    },
    {
        "source": "/portfolio/apoyo-del-autobianchi-a112-cr-15",
        "destination": "/portfolio/apoyo-del-autobianchi-a112",
        "permanent": true
    },
    {
        "source": "/portfolio/mirada-infantil-vc-33",
        "destination": "/portfolio/plaza-de-villanueva-de-la-vera",
        "permanent": true
    },
    {
        "source": "/portfolio/calor-y-tierra-vc-34",
        "destination": "/portfolio/claroscuro-en-la-calleja",
        "permanent": true
    },
    {
        "source": "/portfolio/sombra-del-palmeral-vc-35",
        "destination": "/portfolio/silencio-en-el-casco-historico",
        "permanent": true
    },
    {
        "source": "/portfolio/rostro-al-sol-vc-36",
        "destination": "/portfolio/escalinata-de-la-kasbah",
        "permanent": true
    },
    {
        "source": "/portfolio/salida-del-zoco-vc-37",
        "destination": "/portfolio/verdor-entre-muros-veratos",
        "permanent": true
    },
    {
        "source": "/portfolio/calma-en-el-campamento-vc-38",
        "destination": "/portfolio/siluetas-bajo-el-sol-del-desierto",
        "permanent": true
    },
    {
        "source": "/portfolio/horizonte-calido-vc-39",
        "destination": "/portfolio/horizonte-de-dunas-al-atardecer",
        "permanent": true
    },
    {
        "source": "/portfolio/dunas-en-el-crepusculo-vc-40",
        "destination": "/portfolio/dunas-en-el-crepusculo",
        "permanent": true
    },
    {
        "source": "/portfolio/paso-en-la-sombra-vc-41",
        "destination": "/portfolio/caminantes-en-la-inmensidad",
        "permanent": true
    },
    {
        "source": "/portfolio/olas-de-arena-vc-42",
        "destination": "/portfolio/ocaso-sobre-el-erg",
        "permanent": true
    },
    {
        "source": "/portfolio/el-oficio-y-la-chispa-vc-44",
        "destination": "/portfolio/el-oficio-y-la-chispa",
        "permanent": true
    },
    {
        "source": "/portfolio/umbral-de-la-medina-au-8",
        "destination": "/portfolio/umbral-de-la-medina",
        "permanent": true
    },
    {
        "source": "/portfolio/linterna-y-arco-dorado-au-9",
        "destination": "/portfolio/linterna-y-arco-dorado",
        "permanent": true
    },
    {
        "source": "/portfolio/arco-polilobulado-en-luz-au-10",
        "destination": "/portfolio/arco-polilobulado-en-luz",
        "permanent": true
    },
    {
        "source": "/portfolio/vidriera-y-silueta-en-el-patio-au-11",
        "destination": "/portfolio/vidriera-y-silueta-en-el-patio",
        "permanent": true
    },
    {
        "source": "/portfolio/tornero-de-madera-en-el-zoco-vc-45",
        "destination": "/portfolio/tornero-de-madera-en-el-zoco",
        "permanent": true
    },
    {
        "source": "/portfolio/contraluz-en-el-callejon-del-zoco-vc-46",
        "destination": "/portfolio/contraluz-en-el-callejon-del-zoco",
        "permanent": true
    },
    {
        "source": "/portfolio/pliegues-del-alto-atlas-pd-10",
        "destination": "/portfolio/pliegues-del-alto-atlas",
        "permanent": true
    },
    {
        "source": "/portfolio/oasis-y-cumbres-del-atlas-pd-11",
        "destination": "/portfolio/oasis-y-cumbres-del-atlas",
        "permanent": true
    },
    {
        "source": "/portfolio/arista-de-arena-y-sombra-pd-12",
        "destination": "/portfolio/arista-de-arena-y-sombra",
        "permanent": true
    },
    {
        "source": "/portfolio/ciguena-bajo-la-lluvia-fn-14",
        "destination": "/portfolio/ciguena-bajo-la-lluvia",
        "permanent": true
    },
    {
        "source": "/portfolio/cuervo-canario-ante-las-cumbres-fn-15",
        "destination": "/portfolio/cuervo-canario-ante-las-cumbres",
        "permanent": true
    },
    {
        "source": "/portfolio/despliegue-de-alas-en-la-cresta-fn-16",
        "destination": "/portfolio/despliegue-de-alas-en-la-cresta",
        "permanent": true
    },
    {
        "source": "/portfolio/vela-de-cristal-carabela-portuguesa-fn-17",
        "destination": "/portfolio/vela-de-cristal-carabela-portuguesa",
        "permanent": true
    },
    {
        "source": "/portfolio/cangrejo-moro-en-el-basalto-fn-18",
        "destination": "/portfolio/cangrejo-moro-en-el-basalto",
        "permanent": true
    },
    {
        "source": "/portfolio/mariposa-monarca-a-contraluz-fn-19",
        "destination": "/portfolio/mariposa-monarca-a-contraluz",
        "permanent": true
    },
    {
        "source": "/portfolio/gaviota-sobre-azul-cobalto-fn-20",
        "destination": "/portfolio/gaviota-sobre-azul-cobalto",
        "permanent": true
    },
    {
        "source": "/portfolio/vuelvepiedras-en-la-orilla-volcanica-fn-21",
        "destination": "/portfolio/vuelvepiedras-en-la-orilla-volcanica",
        "permanent": true
    },
    {
        "source": "/portfolio/gamo-en-el-encinar-fn-22",
        "destination": "/portfolio/gamo-en-el-encinar",
        "permanent": true
    },
    {
        "source": "/portfolio/frontal-clasico-bmw-e30-cr-16",
        "destination": "/portfolio/frontal-clasico-bmw-e30",
        "permanent": true
    },
    {
        "source": "/portfolio/el-esfuerzo-del-portador-vc-47",
        "destination": "/portfolio/el-esfuerzo-del-portador",
        "permanent": true
    }
];
  },
};

export default nextConfig;
