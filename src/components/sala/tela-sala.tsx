"use client";

import { motion, type Variants } from "motion/react";

import { FieldError } from "@/components/ui/field";
import { transicao } from "@/constants/animacao";
import { STATUS_RODADA } from "@/constants/sala";
import { useMeuVoto } from "@/hooks/use-meu-voto";
import type { EstadoConexao } from "@/hooks/use-sala-ao-vivo";
import type { Sessao } from "@/lib/sessao";
import type { EstadoSala } from "@/schemas/sala.schema";
import { lerErroApi } from "@/services/api-erro";
import type { Handler } from "@/types/common";

import { CabecalhoSala } from "./cabecalho-sala";
import { Historico } from "./historico";
import { Mao } from "./mao";
import { Mesa } from "./mesa";
import { PainelRodada } from "./painel-rodada";

const SEQUENCIA: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.07 } },
};
const BLOCO: Variants = {
  oculto: { opacity: 0, y: 8 },
  visivel: { opacity: 1, y: 0, transition: transicao.padrao },
};

type Props = {
  sala: EstadoSala;
  sessao: Sessao;
  conexao: EstadoConexao;
  onLeave: Handler;
};

export function TelaSala({ sala, sessao, conexao, onLeave }: Props) {
  const rodada = sala.rodadaAtual;
  const { participanteId } = sessao;
  const eu = sala.participantes.find((p) => p.id === participanteId);
  const isVoting = rodada?.status.codigo === STATUS_RODADA.votando;
  const {
    meuVoto,
    votar,
    erro: erroDoVoto,
  } = useMeuVoto({
    codigoSala: sala.codigo,
    participanteId,
    rodadaId: rodada?.id,
  });

  const descricaoDaMao = !rodada
    ? "As cartas ficam liberadas quando uma rodada começar."
    : isVoting
      ? meuVoto
        ? "Pode trocar de carta até alguém revelar os votos."
        : "Escolha uma carta. Ninguém vê o valor até a revelação."
      : "Votos revelados. Comece a próxima rodada para votar de novo.";

  return (
    <motion.main
      variants={SEQUENCIA}
      initial="oculto"
      animate="visivel"
      className="mx-auto grid w-full max-w-280 gap-12 px-6 pt-8 pb-24 sm:gap-14 sm:px-12"
    >
      <motion.div variants={BLOCO}>
        <CabecalhoSala
          codigo={sala.codigo}
          nome={sala.nome}
          conexao={conexao}
          onLeave={onLeave}
        />
      </motion.div>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="grid content-start gap-12 lg:col-span-8">
          <motion.section
            variants={BLOCO}
            className="grid gap-10 rounded-painel bg-folha p-6 sm:p-9"
          >
            <PainelRodada sala={sala} participanteId={participanteId} />
            <Mesa
              codigoSala={sala.codigo}
              participanteId={participanteId}
              participantes={sala.participantes}
              rodada={rodada}
              meuVoto={isVoting ? meuVoto : null}
            />
          </motion.section>

          <motion.div variants={BLOCO} className="grid gap-3">
            {eu?.papel === "VOTANTE" ? (
              <Mao
                cartas={sala.baralho.cartas}
                meuVoto={isVoting ? meuVoto : null}
                description={descricaoDaMao}
                isActive={isVoting}
                onVote={votar}
              />
            ) : (
              <p className="text-[0.9375rem] text-musgo">
                Você está assistindo. Observadores não votam.
              </p>
            )}
            {erroDoVoto && (
              <FieldError>{lerErroApi(erroDoVoto).mensagem}</FieldError>
            )}
          </motion.div>
        </div>

        <motion.aside variants={BLOCO} className="lg:col-span-4 lg:pt-9">
          <Historico codigoSala={sala.codigo} />
        </motion.aside>
      </div>
    </motion.main>
  );
}
