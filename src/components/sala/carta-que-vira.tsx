"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FaceCarta, VersoCarta } from "@/components/carta/carta";
import { ATRASO_ENTRE_CARTAS, transicao } from "@/lib/movimento";

type Props = {
  semente: string;
  valor: string | null;
  revelada: boolean;
  /** Posição na mesa: define o atraso escalonado da revelação. */
  indice: number;
};

/**
 * A revelação: a carta gira no eixo Y e mostra a face. As duas faces ficam empilhadas;
 * a de trás começa girada 180° e com `backface-visibility: hidden`, então só uma aparece por vez.
 *
 * `initial={false}`: quem abre a sala com a rodada já revelada vê as cartas viradas, sem animação.
 * Com prefers-reduced-motion, o giro vira uma troca com fade.
 */
export function CartaQueVira({ semente, valor, revelada, indice }: Props) {
  const reduzido = useReducedMotion();
  const atraso = revelada ? indice * ATRASO_ENTRE_CARTAS : 0;

  if (reduzido) {
    return (
      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={revelada ? "face" : "verso"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...transicao.padrao, delay: atraso }}
          >
            {revelada && valor ? (
              <FaceCarta valor={valor} tamanho="mesa" />
            ) : (
              <VersoCarta semente={semente} tamanho="mesa" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="[perspective:700px]">
      <motion.div
        className="relative [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: revelada ? 180 : 0 }}
        transition={{ ...transicao.revelacao, delay: atraso }}
      >
        <div className="face-oculta">
          <VersoCarta semente={semente} tamanho="mesa" />
        </div>
        <div className="face-oculta absolute inset-0 [transform:rotateY(180deg)]">
          {valor && <FaceCarta valor={valor} tamanho="mesa" />}
        </div>
      </motion.div>
    </div>
  );
}
