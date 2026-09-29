import type { Transition } from "motion/react";

export const curvaSuave = [0.22, 1, 0.36, 1] as const;

export const transicao = {
  padrao: { duration: 0.22, ease: curvaSuave },
  rapida: { duration: 0.16, ease: curvaSuave },
  mola: { type: "spring", stiffness: 260, damping: 32, mass: 0.9 },
  revelacao: { duration: 0.42, ease: curvaSuave },
} satisfies Record<string, Transition>;

export const ATRASO_ENTRE_CARTAS = 0.06;
