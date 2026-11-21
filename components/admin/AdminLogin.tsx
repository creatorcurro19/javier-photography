"use client";

import React, { useState } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "./AdminIcons";

interface AdminLoginProps {
  onLoginSuccess: (user: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("admin");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError("Introduce la clave de acceso de 5 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Guardar token en localStorage como respaldo local
        if (data.token) {
          try {
            localStorage.setItem("je_admin_token", data.token);
          } catch {
            // ignore
          }
        }
        onLoginSuccess(data.user || "Admin");
      } else {
        setError(data.error || "Clave de acceso incorrecta. Verifica el código 88722.");
      }
    } catch {
      setError("Error de red conectando con el portal de autor.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    setError(null);
    if (val === "clear") {
      setPin("");
    } else if (val === "back") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      if (pin.length < 8) {
        const next = pin + val;
        setPin(next);
        // Si completa 5 dígitos y es 88722, permitir envío rápido
        if (next === "88722") {
          setTimeout(() => {
            // auto-trigger
          }, 150);
        }
      }
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#26282D] bg-[#121316] p-6 shadow-2xl backdrop-blur-md sm:p-8">
        {/* Encabezado de Autor */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#C5A880]/30 bg-[#1A1C20] text-[#C5A880] shadow-inner">
            <LockIcon className="h-6 w-6 text-[#C5A880]" />
          </div>
          <span className="font-mono text-xs tracking-widest text-[#C5A880] uppercase">
            Acceso Creador &middot; Estudio Privado
          </span>
          <h1 className="mt-2 font-serif text-2xl font-light tracking-wide text-[#EBE7DF] sm:text-3xl">
            Javier Espinosa
          </h1>
          <p className="mt-1 text-xs text-[#A39E93]">
            Gestión editorial de obras, títulos, descripciones y precios Fine Art.
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-center text-xs text-red-200 animate-fadeIn">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A39E93] uppercase tracking-wider mb-1.5">
              Usuario o Identificador
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
              autoComplete="username"
              className="w-full rounded-lg border border-[#2D3036] bg-[#181A1F] px-4 py-3 text-sm text-[#EBE7DF] placeholder-[#605C55] transition focus:border-[#C5A880] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A39E93] uppercase tracking-wider mb-1.5">
              Clave de Acceso (PIN)
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;"
                autoFocus
                className="w-full rounded-lg border border-[#2D3036] bg-[#181A1F] px-4 py-3 font-mono text-base tracking-widest text-[#EBE7DF] placeholder-[#605C55] transition focus:border-[#C5A880] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E93] hover:text-[#EBE7DF] p-1 transition"
                aria-label={showPin ? "Ocultar clave" : "Mostrar clave"}
              >
                {showPin ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Teclado numérico táctil rápido para móvil */}
          <div className="pt-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#A39E93] uppercase tracking-wider">
                Teclado rápido táctil
              </span>
              <span className="font-mono text-[10px] text-[#C5A880]/70">
                {pin.length} / 5 dígitos
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className="flex h-11 items-center justify-center rounded-lg border border-[#282A30] bg-[#16171B] font-mono text-base font-medium text-[#EBE7DF] active:bg-[#C5A880] active:text-[#0B0C0E] transition-colors"
                >
                  {k === "clear" ? (
                    <span className="text-[10px] uppercase tracking-wider text-[#A39E93]">Borrar</span>
                  ) : k === "back" ? (
                    <span className="text-sm text-[#A39E93]">&larr;</span>
                  ) : (
                    k
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] py-3.5 px-4 font-sans text-sm font-semibold tracking-wider text-[#0B0C0E] uppercase shadow-lg shadow-[#C5A880]/10 transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? "Verificando clave..." : "Entrar al Panel de Control"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#202227] pt-4 text-center">
          <p className="font-mono text-[11px] text-[#716C62]">
            Clave autorizada configurada para Javier Espinosa
          </p>
        </div>
      </div>
    </div>
  );
}
