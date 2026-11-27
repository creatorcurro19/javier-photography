/**
 * ÚNICA FUENTE DE VERDAD PARA PLAZOS Y TIEMPOS DE RESPUESTA (/data/plazos.ts)
 * Evita promesas numéricas rígidas en portada, servicios, láminas, fichas y formularios.
 */

export const PLAZOS = {
  copias: "El plazo de producción y entrega se confirma al aceptar el pedido.",
  reportajes: "Los plazos de entrega se acuerdan en el presupuesto.",
  rallyPrensa: "Entrega prioritaria para prensa, a convenir.",
  respuesta: "Respondo personalmente a cada consulta lo antes posible.",
  tabla: "A confirmar",
} as const;

export const PLAZOS_EN = {
  copias: "Production and delivery lead time is confirmed upon order acceptance.",
  reportajes: "Delivery timelines are agreed in the project quote.",
  rallyPrensa: "Priority press selection, by arrangement.",
  respuesta: "I personally reply to every inquiry as soon as possible.",
  tabla: "To be confirmed",
} as const;
