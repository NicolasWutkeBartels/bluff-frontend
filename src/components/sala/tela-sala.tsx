"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, type Variants } from "motion/react";
import { useState } from "react";

import { MensagemErro } from "@/components/formulario/campo";
import { lerErro, votar } from "@/lib/api";
import type { EstadoConexao } from "@/lib/ao-vivo";
import { chaves } from "@/lib/consultas";
import { STATUS_RODADA, type EstadoSala } from "@/lib/esquemas";
import { transicao } from "@/lib/movimento";
import { lerMeuVoto, salvarMeuVoto, type Sessao } from "@/lib/sessao";

import { CabecalhoSala } from "./cabecalho-sala";
import { Historico } from "./historico";
import { Mao } from "./mao";
import { Mesa } from "./mesa";
import { PainelRodada } from "./painel-rodada";

/** A única entrada orquestrada do app: os blocos da sala surgem em sequência curta. */
const sequencia: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.07 } },
};
const bloco: Variants = {
  oculto: { opacity: 0, y: 8 },
  visivel: { opacity: 1, y: 0, transition: transicao.padrao },
};

type Props = {
  sala: EstadoSala;
  sessao: Sessao;
  conexao: EstadoConexao;
  aoSair: () => void;
};

export function TelaSala({ sala, sessao, conexao, aoSair }: Props) {
  const queryClient = useQueryClient();
  const rodada = sala.rodadaAtual;
  const meuId = sessao.participanteId;
  const eu = sala.participantes.find((p) => p.id === meuId);
  const votando = rodada?.status.codigo === STATUS_RODADA.votando;

  // A API não devolve o valor do meu voto antes da revelação; ele vem do localStorage.
  // Quando a rodada muda, relemos (padrão "ajustar estado quando uma prop muda", sem useEffect).
  const [rodadaDoVoto, setRodadaDoVoto] = useState(rodada?.id);
  const [meuVoto, setMeuVoto] = useState(() => (rodada ? lerMeuVoto(rodada.id) : null));
  if (rodada?.id !== rodadaDoVoto) {
    setRodadaDoVoto(rodada?.id);
    setMeuVoto(rodada ? lerMeuVoto(rodada.id) : null);
  }

  const votacao = useMutation({
    mutationFn: ({ rodadaId, valor }: { rodadaId: string; valor: string }) => votar(rodadaId, meuId, valor),
    // Otimista: a carta vai para a mesa na hora; se a API recusar, volta para a mão.
    onMutate: ({ rodadaId, valor }) => {
      const anterior = meuVoto;
      setMeuVoto(valor);
      salvarMeuVoto(rodadaId, valor);
      return { anterior };
    },
    onError: (_erro, { rodadaId }, contexto) => {
      setMeuVoto(contexto?.anterior ?? null);
      salvarMeuVoto(rodadaId, contexto?.anterior ?? null);
    },
    onSuccess: (_resposta, { rodadaId }) => {
      // Mesmo efeito do evento VOTO_REGISTRADO, caso ele chegue depois (ou nunca, se a conexão caiu).
      queryClient.setQueryData<EstadoSala>(chaves.sala(sala.codigo), (atual) => {
        const r = atual?.rodadaAtual;
        if (!atual || !r || r.id !== rodadaId || r.votos.some((v) => v.participanteId === meuId)) return atual;
        return { ...atual, rodadaAtual: { ...r, votos: [...r.votos, { participanteId: meuId, valor: null }] } };
      });
    },
  });

  const souVotante = eu?.papel === "VOTANTE";
  const dicaDaMao = !rodada
    ? "As cartas ficam liberadas quando uma rodada começar."
    : votando
      ? meuVoto
        ? "Pode trocar de carta até alguém revelar os votos."
        : "Escolha uma carta. Ninguém vê o valor até a revelação."
      : "Votos revelados. Comece a próxima rodada para votar de novo.";

  return (
    <motion.main
      variants={sequencia}
      initial="oculto"
      animate="visivel"
      className="mx-auto grid w-full max-w-[1120px] gap-12 px-6 pt-8 pb-24 sm:gap-14 sm:px-12"
    >
      <motion.div variants={bloco}>
        <CabecalhoSala codigo={sala.codigo} nome={sala.nome} conexao={conexao} aoSair={aoSair} />
      </motion.div>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="grid content-start gap-12 lg:col-span-8">
          <motion.section variants={bloco} className="grid gap-10 rounded-painel bg-folha p-6 sm:p-9">
            <PainelRodada sala={sala} meuId={meuId} />
            <Mesa
              codigoSala={sala.codigo}
              participantes={sala.participantes}
              rodada={rodada}
              meuId={meuId}
              meuVoto={votando ? meuVoto : null}
            />
          </motion.section>

          <motion.div variants={bloco} className="grid gap-3">
            {souVotante ? (
              <Mao
                cartas={sala.baralho.cartas}
                ativa={votando}
                meuVoto={votando ? meuVoto : null}
                aoVotar={(valor) => rodada && valor !== meuVoto && votacao.mutate({ rodadaId: rodada.id, valor })}
                dica={dicaDaMao}
              />
            ) : (
              <p className="text-[15px] text-musgo">Você está assistindo. Observadores não votam.</p>
            )}
            {votacao.isError && <MensagemErro>{lerErro(votacao.error).mensagem}</MensagemErro>}
          </motion.div>
        </div>

        <motion.aside variants={bloco} className="lg:col-span-4 lg:pt-9">
          <Historico codigoSala={sala.codigo} />
        </motion.aside>
      </div>
    </motion.main>
  );
}
