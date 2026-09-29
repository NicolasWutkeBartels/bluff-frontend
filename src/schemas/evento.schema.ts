import { z } from "zod";

import { participanteSchema } from "./participante.schema";
import { rodadaSchema } from "./rodada.schema";

export const eventoSalaSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("PARTICIPANTE_ENTROU"),
    dados: participanteSchema,
  }),
  z.object({
    tipo: z.literal("PARTICIPANTE_SAIU"),
    dados: z.object({ participanteId: z.uuid() }),
  }),
  z.object({ tipo: z.literal("RODADA_INICIADA"), dados: rodadaSchema }),
  z.object({
    tipo: z.literal("VOTO_REGISTRADO"),
    dados: z.object({ rodadaId: z.uuid(), participanteId: z.uuid() }),
  }),
  z.object({ tipo: z.literal("RODADA_REVELADA"), dados: rodadaSchema }),
]);
export type EventoSala = z.infer<typeof eventoSalaSchema>;
