import { cn } from "cn";
import Link from "next/link";

import { VersoTruchet } from "@/components/carta/verso-truchet";

/** O verso da "sala BLUFF" é a marca do app. O mesmo desenho está no favicon (app/icon.svg). */
export const SEMENTE_DA_MARCA = "BLUFF";

export function MarcaBluff({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block aspect-[5/7] w-5 overflow-hidden rounded-[3px] border border-nanquim/25 bg-papel",
        className,
      )}
    >
      <VersoTruchet semente={SEMENTE_DA_MARCA} colunas={2} linhas={3} />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-controle text-[19px] font-[650] tracking-[-0.02em] text-nanquim [font-stretch:90%]",
        className,
      )}
    >
      <MarcaBluff />
      Bluff
    </Link>
  );
}
