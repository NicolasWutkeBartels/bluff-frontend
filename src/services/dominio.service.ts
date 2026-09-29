import { z } from "zod";

import { itemDominioSchema } from "@/schemas/dominio.schema";

import { apiClient } from "./api-client";

export const dominioService = {
  async listar(dominio: string) {
    const { data } = await apiClient.get("/dominios", { params: { dominio } });
    return z.array(itemDominioSchema).parse(data);
  },
};
