import { cn } from "cn";
import type { ComponentProps } from "react";

import type { CartaProps, TamanhoCarta } from "@/types/carta";

export const LARGURAS_CARTA: Record<TamanhoCarta, string> = {
  mini: "w-7",
  mesa: "w-16 sm:w-19",
  mao: "w-10 min-[26.25rem]:w-11 sm:w-16",
  vitrine: "w-26 sm:w-32",
};

export function CorpoCarta({
  size,
  className,
  ...props
}: CartaProps<ComponentProps<"div">>) {
  return (
    <div
      className={cn(
        "relative aspect-5/7 shrink-0 overflow-hidden rounded-carta border border-nanquim/12 bg-papel shadow-carta",
        LARGURAS_CARTA[size],
        className,
      )}
      {...props}
    />
  );
}
