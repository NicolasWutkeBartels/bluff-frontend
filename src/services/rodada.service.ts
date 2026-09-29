import { z } from "zod";

import { rodadaSchema } from "@/schemas/rodada.schema";

import { apiClient, comParticipante } from "./api-client";

export const rodadaService = {
  async listarHistorico(codigoSala: string, status?: string) {
    const { data } = await apiClient.get(`/salas/${codigoSala}/rodadas`, {
      params: status ? { status } : {},
    });
    return z.array(rodadaSchema).parse(data);
  },

  async iniciar(codigoSala: string, participanteId: string, titulo: string) {
    const { data } = await apiClient.post(
      `/salas/${codigoSala}/rodadas`,
      { titulo },
      comParticipante(participanteId),
    );
    return rodadaSchema.parse(data);
  },

  async votar(rodadaId: string, participanteId: string, valor: string) {
    await apiClient.post(
      `/rodadas/${rodadaId}/votos`,
      { valor },
      comParticipante(participanteId),
    );
  },

  async revelar(
    rodadaId: string,
    participanteId: string,
    estimativaFinal?: string,
  ) {
    const { data } = await apiClient.post(
      `/rodadas/${rodadaId}/revelar`,
      { estimativaFinal: estimativaFinal || null },
      comParticipante(participanteId),
    );
    return rodadaSchema.parse(data);
  },
};
