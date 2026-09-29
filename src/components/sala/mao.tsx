"use client";

import { cn } from "cn";
import { motion } from "motion/react";

import { FaceCarta } from "@/components/carta/face-carta";
import { LugarVazio } from "@/components/carta/lugar-vazio";
import { transicao } from "@/constants/animacao";
import type { Handler, Nullable } from "@/types/common";

type Props = {
  cartas: string[];
  meuVoto: Nullable<string>;
  description: string;
  isActive: boolean;
  onVote: Handler<string>;
};

export function Mao({ cartas, meuVoto, description, isActive, onVote }: Props) {
  return (
    <section aria-labelledby="titulo-mao" className="grid gap-5">
      <div className="grid gap-1">
        <h2 id="titulo-mao" className="text-[0.9375rem] font-semibold">
          Sua carta
        </h2>
        <p className="text-[0.8125rem] text-musgo">{description}</p>
      </div>

      <ul className="flex flex-wrap gap-2 sm:gap-3">
        {cartas.map((carta) => {
          const isChosen = isActive && meuVoto === carta;
          const isFaded = !isActive || (meuVoto !== null && !isChosen);
          return (
            <li key={carta}>
              {isChosen ? (
                <LugarVazio size="mao" />
              ) : (
                <motion.button
                  type="button"
                  layoutId={isActive ? `carta-${carta}` : undefined}
                  disabled={!isActive}
                  onClick={() => onVote(carta)}
                  aria-label={`Votar ${carta}`}
                  animate={{ opacity: isFaded ? 0.45 : 1 }}
                  transition={transicao.mola}
                  className={cn(
                    "block rounded-carta transition-opacity focus-visible:outline-offset-4 disabled:cursor-not-allowed",
                    isActive && "cursor-pointer hover:opacity-100!",
                  )}
                >
                  <FaceCarta
                    value={carta}
                    size="mao"
                    className={cn(
                      "transition-colors duration-150 ease-suave",
                      isActive && "hover:border-nanquim/35",
                    )}
                  />
                </motion.button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
