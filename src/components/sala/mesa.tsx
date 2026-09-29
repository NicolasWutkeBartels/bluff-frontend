"use client";

import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ATRASO_ENTRE_CARTAS, transicao } from "@/constants/animacao";
import { STATUS_RODADA } from "@/constants/sala";
import type { Participante } from "@/schemas/participante.schema";
import type { Rodada } from "@/schemas/rodada.schema";
import type { Nullable } from "@/types/common";
import type { ParticipanteNaSala } from "@/types/sala";

import { LugarNaMesa } from "./lugar-na-mesa";

type Props = ParticipanteNaSala<{
  participantes: Participante[];
  rodada: Nullable<Rodada>;
  meuVoto: Nullable<string>;
}>;

export function Mesa({
  codigoSala,
  participanteId,
  participantes,
  rodada,
  meuVoto,
}: Props) {
  const votantes = participantes.filter((p) => p.papel === "VOTANTE");
  const observadores = participantes.filter((p) => p.papel === "OBSERVADOR");
  const isRevealed = rodada?.status.codigo === STATUS_RODADA.revelada;

  const valores = rodada?.votos.map((v) => v.valor) ?? [];
  const consenso =
    isRevealed && valores.length >= 2 && valores.every((v) => v === valores[0]);

  const chaveAtual = `${rodada?.id}:${rodada?.status.codigo}`;
  const [chaveAnterior, setChaveAnterior] = useState(chaveAtual);
  const [pulsoDaRodada, setPulsoDaRodada] = useState<Nullable<string>>(null);
  if (chaveAtual !== chaveAnterior) {
    if (
      rodada &&
      consenso &&
      chaveAnterior === `${rodada.id}:${STATUS_RODADA.votando}`
    ) {
      setPulsoDaRodada(rodada.id);
    }
    setChaveAnterior(chaveAtual);
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {consenso && pulsoDaRodada === rodada?.id && (
          <motion.div
            key={rodada.id}
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-[1.625rem] border-2 border-caqui"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.98, 1, 1.01] }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.42 + votantes.length * ATRASO_ENTRE_CARTAS,
            }}
          />
        )}
      </AnimatePresence>

      <ul
        aria-label="Mesa"
        className="flex flex-wrap gap-x-5 gap-y-7 sm:gap-x-7"
      >
        <AnimatePresence initial={false}>
          {votantes.map((participante, index) => {
            const isMe = participante.id === participanteId;
            return (
              <motion.li
                key={participante.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: participante.online || isMe ? 1 : 0.4 }}
                exit={{ opacity: 0 }}
                transition={transicao.padrao}
                className="grid justify-items-center gap-2.5"
              >
                <LugarNaMesa
                  codigoSala={codigoSala}
                  rodada={rodada}
                  voto={rodada?.votos.find(
                    (v) => v.participanteId === participante.id,
                  )}
                  meuVoto={isMe ? meuVoto : null}
                  index={index}
                />
                <span
                  className={cn(
                    "max-w-19 truncate text-[0.8125rem] leading-none",
                    isMe ? "font-semibold text-nanquim" : "text-musgo",
                  )}
                  title={
                    participante.online
                      ? participante.apelido
                      : `${participante.apelido} (fora da sala)`
                  }
                >
                  {isMe ? "Você" : participante.apelido}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {observadores.length > 0 && (
        <p className="mt-8 text-[0.8125rem] text-musgo">
          Assistindo:{" "}
          {new Intl.ListFormat("pt-BR").format(
            observadores.map((o) =>
              o.id === participanteId ? "você" : o.apelido,
            ),
          )}
        </p>
      )}
    </div>
  );
}
