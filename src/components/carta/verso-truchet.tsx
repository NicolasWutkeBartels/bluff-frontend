import { cn } from "cn";
import { useMemo } from "react";

import { caminhoTruchet } from "@/lib/truchet";

type Props = {
  /** Código da sala (ou outro texto): define o desenho. */
  semente: string;
  colunas?: number;
  linhas?: number;
  className?: string;
};

const LADO = 10;
const MARGEM = 4;

/**
 * O verso da carta: uma moldura fina e, dentro dela, o ladrilho de Truchet da sala.
 * O traço tem espessura fixa na tela (non-scaling-stroke), então o verso fica igual
 * numa carta de 28 px ou de 80 px.
 */
export function VersoTruchet({ semente, colunas = 4, linhas = 6, className }: Props) {
  const d = useMemo(() => caminhoTruchet(semente, colunas, linhas, LADO), [semente, colunas, linhas]);
  const largura = colunas * LADO + MARGEM * 2;
  const altura = linhas * LADO + MARGEM * 2;

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
