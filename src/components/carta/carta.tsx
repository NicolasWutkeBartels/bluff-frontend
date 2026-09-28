import { cn } from "cn";
import type { ComponentProps } from "react";

import { VersoTruchet } from "./verso-truchet";

/*
 * Peças básicas da carta. A carta é o único elemento do app com corpo:
 * proporção de carta real (5:7), raio pequeno, borda fina e uma sombra curta.
 */

export type TamanhoCarta = "mini" | "mesa" | "mao" | "vitrine";

const larguras: Record<TamanhoCarta, string> = {
  mini: "w-7",
  mesa: "w-[64px] sm:w-[76px]",
  mao: "w-[40px] min-[420px]:w-[44px] sm:w-[64px]",
  vitrine: "w-[104px] sm:w-[128px]",
};

const tamanhosDoValor: Record<TamanhoCarta, string> = {
  mini: "text-[13px] font-[650]",
  mesa: "text-[28px] sm:text-[32px] font-[700]",
  mao: "text-[18px] sm:text-[26px] font-[650]",
  vitrine: "text-[52px] sm:text-[64px] font-[700]",
};

/** Moldura comum: proporção, raio, borda e sombra. */
export function CorpoCarta({
  tamanho,
  className,
  ...props
}: ComponentProps<"div"> & { tamanho: TamanhoCarta }) {
  return (
    <div
      className={cn(
        "relative aspect-[5/7] shrink-0 overflow-hidden rounded-carta border border-nanquim/12 bg-papel shadow-carta",
        larguras[tamanho],
        className,
      )}
      {...props}
    />
  );
}

/** Face: o valor grande, com algarismos tabulares e a largura estreita da Bricolage. */
export function FaceCarta({ valor, tamanho, className }: { valor: string; tamanho: TamanhoCarta; className?: string }) {
  return (
    <CorpoCarta tamanho={tamanho} className={className}>
      <span
        className={cn(
          "algarismos absolute inset-0 flex items-center justify-center leading-none tracking-[-0.03em] text-nanquim [font-stretch:80%]",
          tamanhosDoValor[tamanho],
        )}
      >
        {valor}
      </span>
    </CorpoCarta>
  );
}

/** Verso: o padrão da sala. É assim que um voto escondido aparece. */
export function VersoCarta({
  semente,
  tamanho,
  className,
}: {
  semente: string;
  tamanho: TamanhoCarta;
  className?: string;
}) {
  const grade = tamanho === "mini" ? { colunas: 2, linhas: 3 } : { colunas: 4, linhas: 6 };
  return (
    <CorpoCarta tamanho={tamanho} className={className}>
      <VersoTruchet semente={semente} {...grade} />
    </CorpoCarta>
  );
}

/** Lugar vazio na mesa: contorno tracejado, sem corpo. `esperando` pulsa bem devagar. */
export function LugarVazio({
  tamanho,
  esperando = false,
  className,
}: {
  tamanho: TamanhoCarta;
  esperando?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aspect-[5/7] shrink-0 rounded-carta border border-dashed border-musgo/55",
        larguras[tamanho],
        esperando && "animate-espera",
        className,
      )}
    />
  );
}
