"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { comRodadaAtual } from "@/lib/estado-sala";
import type { Rodada } from "@/schemas/rodada.schema";
import type { EstadoSala } from "@/schemas/sala.schema";
import { rodadaService } from "@/services/rodada.service";
import type { ParticipanteNaSala } from "@/types/sala";

import { queryKeys } from "./query-keys";

type RevelarRodada = { rodadaId: string; estimativaFinal?: string };

export function useHistorico(codigoSala: string, status: string) {
  return useQuery({
    queryKey: queryKeys.historicoFiltrado(codigoSala, status),
    queryFn: () =>
      rodadaService.listarHistorico(codigoSala, status || undefined),
  });
}

function useAplicarRodada(codigoSala: string) {
  const queryClient = useQueryClient();
  return (rodada: Rodada) => {
    queryClient.setQueryData<EstadoSala>(
      queryKeys.sala(codigoSala),
      (sala) => sala && comRodadaAtual(sala, rodada),
    );
    queryClient.invalidateQueries({
      queryKey: queryKeys.historico(codigoSala),
    });
  };
}

export function useIniciarRodada({
  codigoSala,
  participanteId,
}: ParticipanteNaSala) {
  const aplicarRodada = useAplicarRodada(codigoSala);
  return useMutation({
    mutationFn: (titulo: string) =>
      rodadaService.iniciar(codigoSala, participanteId, titulo),
    onSuccess: aplicarRodada,
  });
}

export function useRevelarRodada({
  codigoSala,
  participanteId,
}: ParticipanteNaSala) {
  const aplicarRodada = useAplicarRodada(codigoSala);
  return useMutation({
    mutationFn: ({ rodadaId, estimativaFinal }: RevelarRodada) =>
      rodadaService.revelar(rodadaId, participanteId, estimativaFinal),
    onSuccess: aplicarRodada,
  });
}
