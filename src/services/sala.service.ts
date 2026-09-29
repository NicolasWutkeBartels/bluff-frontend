import type { Papel } from "@/schemas/participante.schema";
import {
  entradaSalaSchema,
  estadoSalaSchema,
  type CriarSalaForm,
} from "@/schemas/sala.schema";

import { apiClient } from "./api-client";

export const salaService = {
  async buscar(codigo: string) {
    const { data } = await apiClient.get(`/salas/${codigo}`);
    return estadoSalaSchema.parse(data);
  },

  async criar(dados: CriarSalaForm) {
    const { data } = await apiClient.post("/salas", dados);
    return entradaSalaSchema.parse(data);
  },

  async entrar(codigo: string, dados: { apelido: string; papel: Papel }) {
    const { data } = await apiClient.post(
      `/salas/${codigo}/participantes`,
      dados,
    );
    return entradaSalaSchema.parse(data);
  },
};
