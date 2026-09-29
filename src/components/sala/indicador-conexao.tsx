import { cn } from "cn";

import type { EstadoConexao } from "@/hooks/use-sala-ao-vivo";

const LABELS: Record<EstadoConexao, string> = {
  conectando: "Conectando…",
  "ao-vivo": "Ao vivo",
  reconectando: "Reconectando…",
};

export function IndicadorConexao({ conexao }: { conexao: EstadoConexao }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-[0.8125rem] text-musgo"
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          conexao === "ao-vivo" ? "bg-musgo" : "border border-musgo",
          conexao === "reconectando" && "animate-espera",
        )}
      />
      {LABELS[conexao]}
    </p>
  );
}
