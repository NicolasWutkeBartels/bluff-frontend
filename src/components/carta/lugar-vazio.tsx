import { cn } from "cn";

import type { CartaProps } from "@/types/carta";

import { LARGURAS_CARTA } from "./corpo-carta";

export function LugarVazio({
  size,
  isWaiting = false,
  className,
}: CartaProps<{ isWaiting?: boolean }>) {
  return (
    <div
      className={cn(
        "aspect-5/7 shrink-0 rounded-carta border border-dashed border-musgo/55",
        LARGURAS_CARTA[size],
        isWaiting && "animate-espera",
        className,
      )}
    />
  );
}
