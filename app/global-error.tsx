"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-[#0B0C0E] px-6 text-[#EBE7DF] antialiased">
        <div className="max-w-lg text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#C5A880]">
            Javier Espinosa · Fotografía de Autor
          </p>
          <h1 className="mt-4 font-serif text-3xl font-light text-[#F7F4EE] sm:text-4xl">
            Interrupción momentánea en la galería
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#8E8A80]">
            Por favor, recarga la vista para continuar explorando el catálogo.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => reset()}
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              Recargar galería
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
