import { STATUS_RODADA } from "@/constants/sala";
import type { EstadoSala } from "@/schemas/sala.schema";

import { FormNovaRodada } from "./form-nova-rodada";
import { RevelarVotos } from "./revelar-votos";

type Props = { sala: EstadoSala; participanteId: string };

export function PainelRodada({ sala, participanteId }: Props) {
  const rodada = sala.rodadaAtual;
  const isVoting = rodada?.status.codigo === STATUS_RODADA.votando;

  if (rodada && isVoting) {
    const totalVotantes = sala.participantes.filter(
      (p) => p.papel === "VOTANTE",
    ).length;
    return (
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="grid min-w-0 gap-1.5">
          <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance">
            {rodada.titulo}
          </h2>
          <p
            className="algarismos text-[0.8125rem] text-musgo"
            aria-live="polite"
          >
            {contagemDeVotos(rodada.votos.length, totalVotantes)}
          </p>
        </div>
        <RevelarVotos
          codigoSala={sala.codigo}
          participanteId={participanteId}
          cartas={sala.baralho.cartas}
          rodadaId={rodada.id}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {rodada ? (
        <div className="grid gap-1.5">
          <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance">
            {rodada.titulo}
          </h2>
          <p className="algarismos text-[0.8125rem] text-musgo">
            {rodada.estimativaFinal
              ? `Estimativa final: ${rodada.estimativaFinal}`
              : "Votos revelados"}
          </p>
        </div>
      ) : (
        <div className="grid gap-1.5">
          <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em]">
            Crie a primeira rodada
          </h2>
          <p className="text-[0.8125rem] text-musgo">
            Diga o que o time vai estimar. As cartas ficam liberadas na hora.
          </p>
        </div>
      )}
      <FormNovaRodada
        codigoSala={sala.codigo}
        participanteId={participanteId}
        isFirst={!rodada}
      />
    </div>
  );
}

function contagemDeVotos(votos: number, total: number) {
  if (votos === 0) return "Ninguém votou ainda";
  if (votos >= total)
    return total === 1 ? "Seu voto está na mesa" : "Todos votaram";
  return `${votos} de ${total} já votaram`;
}
