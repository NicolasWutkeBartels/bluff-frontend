"use client";

import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { FaceCarta, LugarVazio } from "@/components/carta/carta";
import { STATUS_RODADA, type Participante, type Rodada } from "@/lib/esquemas";
import { ATRASO_ENTRE_CARTAS, transicao } from "@/lib/movimento";

import { CartaQueVira } from "./carta-que-vira";

type Props = {
  codigoSala: string;
  participantes: Participante[];
  rodada: Rodada | null;
  meuId: string;
  meuVoto: string | null;
};

/**
 * A mesa: uma carta por votante. O estado do voto é o estado da carta:
 * contorno tracejado (ainda não votou), verso da sala (votou), face (revelada).
 */
export function Mesa({ codigoSala, participantes, rodada, meuId, meuVoto }: Props) {
  const votantes = participantes.filter((p) => p.papel === "VOTANTE");
  const observadores = participantes.filter((p) => p.papel === "OBSERVADOR");
  const votando = rodada?.status.codigo === STATUS_RODADA.votando;
  const revelada = rodada?.status.codigo === STATUS_RODADA.revelada;
  const votoDe = (id: string) => rodada?.votos.find((v) => v.participanteId === id);

  const valores = rodada?.votos.map((v) => v.valor) ?? [];
  const consenso = revelada && valores.length >= 2 && valores.every((v) => v === valores[0]);

  // O anel de consenso só pulsa quando a revelação acontece com a tela aberta,
  // não ao abrir uma sala que já estava revelada. Comparamos com o estado anterior durante a renderização.
  const chaveAtual = `${rodada?.id}:${rodada?.status.codigo}`;
  const [chaveAnterior, setChaveAnterior] = useState(chaveAtual);
  const [pulsoDaRodada, setPulsoDaRodada] = useState<string | null>(null);
  if (chaveAtual !== chaveAnterior) {
    if (rodada && consenso && chaveAnterior === `${rodada.id}:${STATUS_RODADA.votando}`) {
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
            className="pointer-events-none absolute -inset-2 rounded-[26px] border-2 border-caqui"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.98, 1, 1.01] }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.42 + votantes.length * ATRASO_ENTRE_CARTAS }}
          />
        )}
      </AnimatePresence>

      <ul aria-label="Mesa" className="flex flex-wrap gap-x-5 gap-y-7 sm:gap-x-7">
        <AnimatePresence initial={false}>
          {votantes.map((participante, indice) => {
            const voto = votoDe(participante.id);
            const souEu = participante.id === meuId;
            return (
              <motion.li
                key={participante.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: participante.online || souEu ? 1 : 0.4 }}
                exit={{ opacity: 0 }}
                transition={transicao.padrao}
                className="grid justify-items-center gap-2.5"
              >
                <LugarNaMesa
                  chave={`${rodada?.id}-${participante.id}`}
                  codigoSala={codigoSala}
                  indice={indice}
                  votando={votando}
                  revelada={revelada}
                  votou={Boolean(voto)}
                  valor={voto?.valor ?? null}
                  meuVoto={souEu ? meuVoto : null}
                />
                <span
                  className={cn(
                    "max-w-[76px] truncate text-[13px] leading-none",
                    souEu ? "font-[600] text-nanquim" : "text-musgo",
                  )}
                  title={participante.online ? participante.apelido : `${participante.apelido} (fora da sala)`}
                >
                  {souEu ? "Você" : participante.apelido}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {observadores.length > 0 && (
        <p className="mt-8 text-[13px] text-musgo">
          Assistindo: {new Intl.ListFormat("pt-BR").format(observadores.map((o) => (o.id === meuId ? "você" : o.apelido)))}
        </p>
      )}
    </div>
  );
}

function LugarNaMesa({
  chave,
  codigoSala,
  indice,
  votando,
  revelada,
  votou,
  valor,
  meuVoto,
}: {
  chave: string;
  codigoSala: string;
  indice: number;
  votando: boolean;
  revelada: boolean;
  votou: boolean;
  valor: string | null;
  meuVoto: string | null;
}) {
  // Minha carta durante a votação: eu sei o que escolhi, então ela fica de face, erguida e com o acento.
  // layoutId igual ao da carta na mão: o Motion desliza a carta da mão até aqui.
  if (votando && meuVoto) {
    return (
      <motion.div layoutId={`carta-${meuVoto}`} animate={{ y: -6 }} transition={transicao.mola}>
        <FaceCarta valor={meuVoto} tamanho="mesa" className="border-caqui ring-1 ring-caqui shadow-carta-alta" />
      </motion.div>
    );
  }
  if ((votando && votou) || (revelada && valor)) {
    return <CartaQueVira key={chave} semente={codigoSala} valor={valor} revelada={revelada} indice={indice} />;
  }
  return <LugarVazio tamanho="mesa" esperando={votando} />;
}
