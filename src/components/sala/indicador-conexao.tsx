import { cn } from "cn";

import type { EstadoConexao } from "@/lib/ao-vivo";

const textos: Record<EstadoConexao, string> = {
  conectando: "Conectando…",
  "ao-vivo": "Ao vivo",
  reconectando: "Reconectando…",
};

/** Discreto de propósito: só chama atenção (pulso lento) quando a conexão caiu. */
export function IndicadorConexao({ estado }: { estado: EstadoConexao }) {
  return (
    <p role="status" aria-live="polite" className="flex items-center gap-2 text-[13px] text-musgo">
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          estado === "ao-vivo" ? "bg-musgo" : "border border-musgo",
          estado === "reconectando" && "animate-espera",
        )}
      />
      {textos[estado]}
    </p>
  );
}
