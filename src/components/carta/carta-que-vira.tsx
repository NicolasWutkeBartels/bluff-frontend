"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ATRASO_ENTRE_CARTAS, transicao } from "@/constants/animacao";
import type { Nullable } from "@/types/common";

import { FaceCarta } from "./face-carta";
import { VersoCarta } from "./verso-carta";

type Props = {
  seed: string;
  value: Nullable<string>;
  isRevealed: boolean;
  index: number;
};

export function CartaQueVira({ seed, value, isRevealed, index }: Props) {
  const reduzido = useReducedMotion();
  const atraso = isRevealed ? index * ATRASO_ENTRE_CARTAS : 0;

  if (reduzido) {
    return (
      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={isRevealed ? "face" : "verso"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...transicao.padrao, delay: atraso }}
          >
            {isRevealed && value ? (
              <FaceCarta value={value} size="mesa" />
            ) : (
              <VersoCarta seed={seed} size="mesa" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="perspective-[43.75rem]">
      <motion.div
        className="relative transform-3d"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ ...transicao.revelacao, delay: atraso }}
      >
        <div className="face-oculta">
          <VersoCarta seed={seed} size="mesa" />
        </div>
        <div className="face-oculta absolute inset-0 rotate-y-180">
          {value && <FaceCarta value={value} size="mesa" />}
        </div>
      </motion.div>
    </div>
  );
}
