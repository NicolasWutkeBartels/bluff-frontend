"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { comVotoRegistrado } from "@/lib/estado-sala";
import { lerMeuVoto, salvarMeuVoto } from "@/lib/sessao";
import type { EstadoSala } from "@/schemas/sala.schema";
import { rodadaService } from "@/services/rodada.service";
import type { ParticipanteNaSala } from "@/types/sala";

import { queryKeys } from "./query-keys";

type Votar = { rodadaId: string; valor: string };

export function useMeuVoto({
  codigoSala,
  participanteId,
  rodadaId,
}: ParticipanteNaSala<{ rodadaId?: string }>) {
  const queryClient = useQueryClient();

  const [rodadaDoVoto, setRodadaDoVoto] = useState(rodadaId);
  const [meuVoto, setMeuVoto] = useState(() =>
    rodadaId ? lerMeuVoto(rodadaId) : null,
  );
  if (rodadaId !== rodadaDoVoto) {
    setRodadaDoVoto(rodadaId);
    setMeuVoto(rodadaId ? lerMeuVoto(rodadaId) : null);
  }

  const votacao = useMutation({
    mutationFn: ({ rodadaId, valor }: Votar) =>
      rodadaService.votar(rodadaId, participanteId, valor),
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
      queryClient.setQueryData<EstadoSala>(
        queryKeys.sala(codigoSala),
        (sala) => sala && comVotoRegistrado(sala, rodadaId, participanteId),
      );
    },
  });

  function votar(valor: string) {
    if (rodadaId && valor !== meuVoto) votacao.mutate({ rodadaId, valor });
  }

  return { meuVoto, votar, erro: votacao.error };
}
