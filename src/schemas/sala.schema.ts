import { z } from "zod";

import { CODIGO_SALA_REGEX } from "@/constants/sala";

import { baralhoSchema } from "./baralho.schema";
import {
  apelidoSchema,
  papelSchema,
  participanteSchema,
} from "./participante.schema";
import { rodadaSchema } from "./rodada.schema";

export const criarSalaFormSchema = z.object({
  nomeSala: z
    .string()
    .trim()
    .min(1, "Dê um nome para a sala.")
    .max(80, "O nome pode ter até 80 caracteres."),
  apelido: apelidoSchema,
  baralho: z.string().min(1, "Escolha um baralho."),
  papel: papelSchema,
});
export type CriarSalaForm = z.infer<typeof criarSalaFormSchema>;

export const entrarSalaFormSchema = z.object({
  codigo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(CODIGO_SALA_REGEX, "O código tem 6 letras e números, como K7PX3M."),
  apelido: apelidoSchema,
  papel: papelSchema,
});
export type EntrarSalaForm = z.infer<typeof entrarSalaFormSchema>;

export const entrarPorConviteFormSchema = entrarSalaFormSchema.omit({
  codigo: true,
});
export type EntrarPorConviteForm = z.infer<typeof entrarPorConviteFormSchema>;

export const estadoSalaSchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  baralho: baralhoSchema,
  participantes: z.array(participanteSchema),
  rodadaAtual: rodadaSchema.nullable(),
});
export type EstadoSala = z.infer<typeof estadoSalaSchema>;

export const entradaSalaSchema = z.object({
  codigoSala: z.string(),
  participante: participanteSchema,
});
export type EntradaSala = z.infer<typeof entradaSalaSchema>;
