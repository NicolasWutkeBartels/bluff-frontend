"use client";

import { cn } from "cn";
import { motion } from "motion/react";

import { FaceCarta, LugarVazio } from "@/components/carta/carta";
import { transicao } from "@/lib/movimento";

type Props = {
  cartas: string[];
  /** Só dá para votar com a rodada em votação. */
  ativa: boolean;
  meuVoto: string | null;
  aoVotar: (valor: string) => void;
  dica: string;
};

/**
 * As cartas do baralho da sala. Escolher uma carta é votar: ela desliza até o seu lugar na mesa
 * (mesmo layoutId dos dois lados) e deixa um contorno aqui. As outras esmaecem,
 * mas continuam clicáveis: dá para trocar de carta até a revelação.
 */
export function Mao({ cartas, ativa, meuVoto, aoVotar, dica }: Props) {
  return (
    <section aria-labelledby="titulo-mao" className="grid gap-5">
      <div className="grid gap-1">
        <h2 id="titulo-mao" className="text-[15px] font-[600]">
          Sua carta
        </h2>
        <p className="text-[13px] text-musgo">{dica}</p>
      </div>

      <ul className="flex flex-wrap gap-2 sm:gap-3">
        {cartas.map((valor) => {
          const escolhida = ativa && meuVoto === valor;
          const esmaecida = !ativa || (meuVoto !== null && !escolhida);
          return (
            <li key={valor}>
              {escolhida ? (
                <LugarVazio tamanho="mao" />
              ) : (
                <motion.button
                  type="button"
                  layoutId={ativa ? `carta-${valor}` : undefined}
                  disabled={!ativa}
                  onClick={() => aoVotar(valor)}
                  aria-label={`Votar ${valor}`}
                  animate={{ opacity: esmaecida ? 0.45 : 1 }}
                  transition={transicao.mola}
                  className={cn(
                    "block rounded-carta transition-opacity focus-visible:outline-offset-4 disabled:cursor-not-allowed",
                    ativa && "cursor-pointer hover:opacity-100!",
                  )}
                >
                  <FaceCarta
                    valor={valor}
                    tamanho="mao"
                    className={cn("transition-colors duration-150 ease-suave", ativa && "hover:border-nanquim/35")}
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
