"use client";

import { Client } from "@stomp/stompjs";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { WS_URL } from "./api";
import { chaves } from "./consultas";
import { eventoSala, type EstadoSala, type EventoSala } from "./esquemas";

export type EstadoConexao = "conectando" | "ao-vivo" | "reconectando";

/**
 * Mantém a sala atualizada em tempo real.
 *
 * Fluxo:
 * 1. Abre uma conexão STOMP em /ws, mandando codigoSala e participanteId no CONNECT
 *    (o back usa isso para saber quem está online).
 * 2. Assina /topic/salas/{codigo} e aplica cada evento direto no cache do React Query.
 * 3. **Reconexão:** se a conexão cair, o stompjs tenta de novo sozinho (reconnectDelay).
 *    Enquanto esteve fora, eventos podem ter sido perdidos, e o broker não os guarda.
 *    Por isso, a cada conexão (a primeira e as seguintes) buscamos GET /salas/{codigo}
 *    de novo: o estado completo substitui o que estiver no cache e nada fica para trás.
 */
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
        const evento = eventoSala.safeParse(JSON.parse(mensagem.body));
        if (evento.success) aplicarEvento(queryClient, codigo, evento.data);
      });
      // Ressincroniza: na primeira conexão, cobre o intervalo entre o GET inicial e a assinatura;
      // nas seguintes, cobre tudo o que aconteceu enquanto estávamos desconectados.
      queryClient.invalidateQueries({ queryKey: chaves.sala(codigo) });
      if (jaConectou) queryClient.invalidateQueries({ queryKey: chaves.historico(codigo) });
      jaConectou = true;
    };
    cliente.onWebSocketClose = () => setEstado(jaConectou ? "reconectando" : "conectando");

    cliente.activate();
    return () => {
      cliente.deactivate();
    };
  }, [codigo, participanteId, queryClient]);

  return estado;
}

/** Aplica um evento no estado da sala em cache, sem ir ao servidor. */
function aplicarEvento(queryClient: QueryClient, codigo: string, evento: EventoSala) {
  const atualizarSala = (mudar: (sala: EstadoSala) => EstadoSala) =>
    queryClient.setQueryData<EstadoSala>(chaves.sala(codigo), (sala) => (sala ? mudar(sala) : sala));

  switch (evento.tipo) {
    case "PARTICIPANTE_ENTROU": {
      const novo = evento.dados;
      atualizarSala((sala) => ({
        ...sala,
        participantes: sala.participantes.some((p) => p.id === novo.id)
          ? sala.participantes.map((p) => (p.id === novo.id ? { ...p, online: novo.online || p.online } : p))
          : [...sala.participantes, novo],
      }));
      break;
    }
    case "PARTICIPANTE_SAIU":
      atualizarSala((sala) => ({
        ...sala,
        participantes: sala.participantes.map((p) =>
          p.id === evento.dados.participanteId ? { ...p, online: false } : p,
        ),
      }));
      break;
    case "VOTO_REGISTRADO": {
      const { rodadaId, participanteId } = evento.dados;
      atualizarSala((sala) => {
        const rodada = sala.rodadaAtual;
        if (!rodada || rodada.id !== rodadaId || rodada.votos.some((v) => v.participanteId === participanteId)) {
          return sala; // trocar de carta não muda nada para os outros
        }
        return { ...sala, rodadaAtual: { ...rodada, votos: [...rodada.votos, { participanteId, valor: null }] } };
      });
      break;
    }
    case "RODADA_INICIADA":
    case "RODADA_REVELADA":
      atualizarSala((sala) => ({ ...sala, rodadaAtual: evento.dados }));
      queryClient.invalidateQueries({ queryKey: chaves.historico(codigo) });
      break;
  }
}
