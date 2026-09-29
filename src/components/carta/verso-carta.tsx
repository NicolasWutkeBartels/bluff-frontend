import type { CartaProps } from "@/types/carta";

import { CorpoCarta } from "./corpo-carta";
import { VersoTruchet } from "./verso-truchet";

export function VersoCarta({
  seed,
  size,
  className,
}: CartaProps<{ seed: string }>) {
  const grid =
    size === "mini" ? { columns: 2, rows: 3 } : { columns: 4, rows: 6 };
  return (
    <CorpoCarta size={size} className={className}>
      <VersoTruchet seed={seed} {...grid} />
    </CorpoCarta>
  );
}
