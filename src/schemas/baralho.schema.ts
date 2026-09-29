import { z } from "zod";

export const baralhoSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
  cartas: z.array(z.string()),
});
export type Baralho = z.infer<typeof baralhoSchema>;
