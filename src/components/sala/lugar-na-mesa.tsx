"use client";

import { motion } from "motion/react";

import { CartaQueVira } from "@/components/carta/carta-que-vira";
import { FaceCarta } from "@/components/carta/face-carta";
import { LugarVazio } from "@/components/carta/lugar-vazio";
import { transicao } from "@/constants/animacao";
import { STATUS_RODADA } from "@/constants/sala";
import type { Rodada, Voto } from "@/schemas/rodada.schema";
import type { Nullable } from "@/types/common";

type Props = {
  codigoSala: string;
  rodada: Nullable<Rodada>;
  voto?: Voto;
  meuVoto: Nullable<string>;
  index: number;
};

export function LugarNaMesa({
  codigoSala,
  rodada,
  voto,
  meuVoto,
  index,
}: Props) {
  const isVoting = rodada?.status.codigo === STATUS_RODADA.votando;
  const isRevealed = rodada?.status.codigo === STATUS_RODADA.revelada;

  if (isVoting && meuVoto) {
    return (
      <motion.div
        layoutId={`carta-${meuVoto}`}
        animate={{ y: -6 }}
        transition={transicao.mola}
      >
        <FaceCarta
          value={meuVoto}
          size="mesa"
          className="border-caqui ring-1 ring-caqui shadow-carta-alta"
        />
      </motion.div>
    );
  }
  if (voto && (isVoting || (isRevealed && voto.valor))) {
    return (
      <CartaQueVira
        key={`${rodada?.id}-${voto.participanteId}`}
        seed={codigoSala}
        value={voto.valor}
        isRevealed={isRevealed}
        index={index}
      />
    );
  }
  return <LugarVazio size="mesa" isWaiting={isVoting} />;
}
