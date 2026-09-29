import { cn } from "cn";

import { VersoTruchet } from "@/components/carta/verso-truchet";
import { SEMENTE_DA_MARCA } from "@/constants/marca";

export function MarcaBluff({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block aspect-5/7 w-5 overflow-hidden rounded-[0.1875rem] border border-nanquim/25 bg-papel",
        className,
      )}
    >
      <VersoTruchet seed={SEMENTE_DA_MARCA} columns={2} rows={3} />
    </span>
  );
}
