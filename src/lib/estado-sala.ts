import type { Participante } from "@/schemas/participante.schema";
import type { Rodada } from "@/schemas/rodada.schema";
import type { EstadoSala } from "@/schemas/sala.schema";

export function comParticipante(
  sala: EstadoSala,
  novo: Participante,
): EstadoSala {
  const jaEsta = sala.participantes.some((p) => p.id === novo.id);
  return {
    ...sala,
    participantes: jaEsta
      ? sala.participantes.map((p) =>
          p.id === novo.id ? { ...p, online: novo.online || p.online } : p,
        )
      : [...sala.participantes, novo],
  };
}

export function comParticipanteOffline(
  sala: EstadoSala,
  participanteId: string,
): EstadoSala {
  return {
    ...sala,
    participantes: sala.participantes.map((p) =>
      p.id === participanteId ? { ...p, online: false } : p,
    ),
  };
}

export function comVotoRegistrado(
  sala: EstadoSala,
  rodadaId: string,
  participanteId: string,
): EstadoSala {
  const rodada = sala.rodadaAtual;
  if (
    !rodada ||
    rodada.id !== rodadaId ||
    rodada.votos.some((v) => v.participanteId === participanteId)
  ) {
    return sala;
  }
  return {
    ...sala,
    rodadaAtual: {
      ...rodada,
      votos: [...rodada.votos, { participanteId, valor: null }],
    },
  };
}

export function comRodadaAtual(sala: EstadoSala, rodada: Rodada): EstadoSala {
  return { ...sala, rodadaAtual: rodada };
}
