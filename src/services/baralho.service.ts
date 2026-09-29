import { z } from "zod";

import { baralhoSchema } from "@/schemas/baralho.schema";

import { apiClient } from "./api-client";

export const baralhoService = {
  async listar() {
    const { data } = await apiClient.get("/baralhos");
    return z.array(baralhoSchema).parse(data);
  },
};
