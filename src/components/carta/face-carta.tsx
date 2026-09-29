import { cn } from "cn";

import type { CartaProps, TamanhoCarta } from "@/types/carta";

import { CorpoCarta } from "./corpo-carta";

const TAMANHOS_DO_VALOR: Record<TamanhoCarta, string> = {
  mini: "text-[0.8125rem] font-[650]",
  mesa: "text-[1.75rem] sm:text-[2rem] font-bold",
  mao: "text-lg sm:text-[1.625rem] font-[650]",
  vitrine: "text-[3.25rem] sm:text-[4rem] font-bold",
};

export function FaceCarta({
  value,
  size,
  className,
}: CartaProps<{ value: string }>) {
  return (
    <CorpoCarta size={size} className={className}>
      <span
        className={cn(
          "algarismos absolute inset-0 flex items-center justify-center leading-none tracking-[-0.03em] text-nanquim font-stretch-80%",
          TAMANHOS_DO_VALOR[size],
        )}
      >
        {value}
      </span>
    </CorpoCarta>
  );
}
