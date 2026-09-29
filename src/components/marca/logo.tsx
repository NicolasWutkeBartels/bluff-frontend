import { cn } from "cn";
import Link from "next/link";

import { MarcaBluff } from "./marca-bluff";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-controle text-[1.1875rem] font-[650] tracking-[-0.02em] text-nanquim font-stretch-90%",
        className,
      )}
    >
      <MarcaBluff />
      Bluff
    </Link>
  );
}
