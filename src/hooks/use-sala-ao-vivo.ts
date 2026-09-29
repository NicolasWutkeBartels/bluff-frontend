"use client";

import { Client } from "@stomp/stompjs";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  comParticipante,
  comParticipanteOffline,
  comRodadaAtual,
  comVotoRegistrado,
} from "@/lib/estado-sala";
import { eventoSalaSchema, type EventoSala } from "@/schemas/evento.schema";
import type { EstadoSala } from "@/schemas/sala.schema";
import { WS_URL } from "@/services/api-client";

import { queryKeys } from "./query-keys";

export type EstadoConexao = "conectando" | "ao-vivo" | "reconectando";

export function useSalaAoVivo(codigo: string, participanteId: string | null) {
  const queryClient = useQueryClient();
  const [estado, setEstado] = useState<EstadoConexao>("conectando");

  useEffect(() => {
    if (!participanteId) return;

    let jaConectou = false;
    const cliente = new Client({
      brokerURL: WS_URL,
      connectHeaders: { codigoSala: codigo, participanteId },
      reconnectDelay: 2_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
    });

    cliente.onConnect = () => {
      setEstado("ao-vivo");
      cliente.subscribe(`/topic/salas/${codigo}`, (mensagem) => {
        const evento = eventoSalaSchema.safeParse(JSON.parse(mensagem.body));
        if (evento.success) aplicarEvento(queryClient, codigo, evento.data);
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.sala(codigo) });
      if (jaConectou)
        queryClient.invalidateQueries({
          queryKey: queryKeys.historico(codigo),
        });
      jaConectou = true;
    };
    cliente.onWebSocketClose = () =>
      setEstado(jaConectou ? "reconectando" : "conectando");

    cliente.activate();
    return () => {
      cliente.deactivate();
    };
  }, [codigo, participanteId, queryClient]);

  return estado;
}

function aplicarEvento(
  queryClient: QueryClient,
  codigo: string,
  evento: EventoSala,
) {
  const atualizarSala = (mudar: (sala: EstadoSala) => EstadoSala) =>
    queryClient.setQueryData<EstadoSala>(
      queryKeys.sala(codigo),
      (sala) => sala && mudar(sala),
    );

  switch (evento.tipo) {
    case "PARTICIPANTE_ENTROU":
      atualizarSala((sala) => comParticipante(sala, evento.dados));
      break;
    case "PARTICIPANTE_SAIU":
      atualizarSala((sala) =>
        comParticipanteOffline(sala, evento.dados.participanteId),
      );
      break;
    case "VOTO_REGISTRADO":
      atualizarSala((sala) =>
        comVotoRegistrado(
          sala,
          evento.dados.rodadaId,
          evento.dados.participanteId,
        ),
      );
      break;
    case "RODADA_INICIADA":
    case "RODADA_REVELADA":
      atualizarSala((sala) => comRodadaAtual(sala, evento.dados));
      queryClient.invalidateQueries({ queryKey: queryKeys.historico(codigo) });
      break;
  }
}
