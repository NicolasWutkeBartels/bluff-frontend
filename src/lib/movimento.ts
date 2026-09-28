import type { Transition } from "motion/react";

/** Desaceleração suave usada em todo o app (a mesma do token --ease-suave no CSS). */
export const curvaSuave = [0.22, 1, 0.36, 1] as const;

export const transicao = {
  /** Padrão para quase tudo: 220 ms. */
  padrao: { duration: 0.22, ease: curvaSuave },
  /** Respostas a um clique: mais curta. */
  rapida: { duration: 0.16, ease: curvaSuave },
  /** Mola sem quique: rigidez baixa, amortecimento alto. */
  mola: { type: "spring", stiffness: 260, damping: 32, mass: 0.9 },
  /** A revelação é o único momento que passa de 300 ms. */
  revelacao: { duration: 0.42, ease: curvaSuave },
} satisfies Record<string, Transition>;

/** Atraso entre uma carta e a próxima na revelação. */
export const ATRASO_ENTRE_CARTAS = 0.06;
