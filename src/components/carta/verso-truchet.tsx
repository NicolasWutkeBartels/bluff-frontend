import { cn } from "cn";
import { useMemo } from "react";

import { caminhoTruchet } from "@/lib/truchet";
import type { WithClassName } from "@/types/common";

type Props = WithClassName<{
  seed: string;
  columns?: number;
  rows?: number;
}>;

const LADO = 10;
const MARGEM = 4;

export function VersoTruchet({
  seed,
  columns = 4,
  rows = 6,
  className,
}: Props) {
  const d = useMemo(
    () => caminhoTruchet(seed, columns, rows, LADO),
    [seed, columns, rows],
  );
  const largura = columns * LADO + MARGEM * 2;
  const altura = rows * LADO + MARGEM * 2;

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("size-full", className)}
    >
      <rect
        x={MARGEM / 2}
        y={MARGEM / 2}
        width={largura - MARGEM}
        height={altura - MARGEM}
        rx={2}
        fill="none"
        className="stroke-nanquim/35"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        transform={`translate(${MARGEM} ${MARGEM})`}
        fill="none"
        className="stroke-nanquim/70"
        strokeWidth={1.25}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
