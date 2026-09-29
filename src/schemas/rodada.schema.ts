import { z } from "zod";

import { itemDominioSchema } from "./dominio.schema";

export const novaRodadaFormSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Diga o que vai ser estimado.")
    .max(200, "Use até 200 caracteres."),
});
export type NovaRodadaForm = z.infer<typeof novaRodadaFormSchema>;

export const votoSchema = z.object({
  participanteId: z.uuid(),
  valor: z.string().nullable(),
});
export type Voto = z.infer<typeof votoSchema>;

export const rodadaSchema = z.object({
  id: z.uuid(),
  titulo: z.string(),
  status: itemDominioSchema,
  estimativaFinal: z.string().nullable(),
  criadoEm: z.string(),
  votos: z.array(votoSchema),
});
export type Rodada = z.infer<typeof rodadaSchema>;
