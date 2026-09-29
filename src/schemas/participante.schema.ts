import { z } from "zod";

export const PAPEIS = ["VOTANTE", "OBSERVADOR"] as const;
export const papelSchema = z.enum(PAPEIS);
export type Papel = z.infer<typeof papelSchema>;

export const apelidoSchema = z
  .string()
  .trim()
  .min(1, "Escolha um apelido.")
  .max(30, "O apelido pode ter até 30 caracteres.");

export const participanteSchema = z.object({
  id: z.uuid(),
  apelido: z.string(),
  papel: papelSchema,
  online: z.boolean(),
});
export type Participante = z.infer<typeof participanteSchema>;
