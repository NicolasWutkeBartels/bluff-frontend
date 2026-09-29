import { z } from "zod";

export const itemDominioSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
});
export type ItemDominio = z.infer<typeof itemDominioSchema>;
