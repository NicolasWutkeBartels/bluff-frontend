import { z } from "zod";

/*
 * Esquemas Zod de duas naturezas:
 * - formulários: validam o que a pessoa digita antes de chamar a API;
 * - respostas: conferem o que a API devolve. Se o back mudar um campo, o erro aparece aqui,
 *   com o nome do campo, em vez de um "undefined" perdido num componente.
 * Os tipos TypeScript saem dos esquemas (z.infer), então há uma única fonte da verdade.
 */

// ---- Valores fixos ---------------------------------------------------------

export const PAPEIS = ["VOTANTE", "OBSERVADOR"] as const;
export const papel = z.enum(PAPEIS);
export type Papel = z.infer<typeof papel>;

/** Alfabeto do código de sala no back: sem 0, O, 1, I, L. */
const CODIGO_SALA = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

// ---- Formulários -----------------------------------------------------------

const apelido = z
  .string()
  .trim()
  .min(1, "Escolha um apelido.")
  .max(30, "O apelido pode ter até 30 caracteres.");

export const formCriarSala = z.object({
  nomeSala: z.string().trim().min(1, "Dê um nome para a sala.").max(80, "O nome pode ter até 80 caracteres."),
  apelido,
  baralho: z.string().min(1, "Escolha um baralho."),
  papel,
});
export type FormCriarSala = z.infer<typeof formCriarSala>;

export const formEntrarSala = z.object({
  codigo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(CODIGO_SALA, "O código tem 6 letras e números, como K7PX3M."),
  apelido,
  papel,
});
export type FormEntrarSala = z.infer<typeof formEntrarSala>;

export const formNovaRodada = z.object({
  titulo: z.string().trim().min(1, "Diga o que vai ser estimado.").max(200, "Use até 200 caracteres."),
});

// ---- Respostas da API ------------------------------------------------------

export const itemDominio = z.object({ codigo: z.string(), descricao: z.string() });
export type ItemDominio = z.infer<typeof itemDominio>;

export const baralho = z.object({
  codigo: z.string(),
  descricao: z.string(),
  cartas: z.array(z.string()),
});
export type Baralho = z.infer<typeof baralho>;

export const participante = z.object({
  id: z.uuid(),
  apelido: z.string(),
  papel,
  online: z.boolean(),
});
export type Participante = z.infer<typeof participante>;

/** Em VOTING, `valor` é sempre null: o back nunca manda o valor antes da revelação. */
export const voto = z.object({
  participanteId: z.uuid(),
  valor: z.string().nullable(),
});
export type Voto = z.infer<typeof voto>;

export const rodada = z.object({
  id: z.uuid(),
  titulo: z.string(),
  status: itemDominio,
  estimativaFinal: z.string().nullable(),
  criadoEm: z.string(),
  votos: z.array(voto),
});
export type Rodada = z.infer<typeof rodada>;

export const estadoSala = z.object({
  codigo: z.string(),
  nome: z.string(),
  baralho,
  participantes: z.array(participante),
  rodadaAtual: rodada.nullable(),
});
export type EstadoSala = z.infer<typeof estadoSala>;

export const entrada = z.object({
  codigoSala: z.string(),
  participante,
});
export type Entrada = z.infer<typeof entrada>;

// ---- Eventos do WebSocket --------------------------------------------------

export const eventoSala = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("PARTICIPANTE_ENTROU"), dados: participante }),
  z.object({ tipo: z.literal("PARTICIPANTE_SAIU"), dados: z.object({ participanteId: z.uuid() }) }),
  z.object({ tipo: z.literal("RODADA_INICIADA"), dados: rodada }),
  z.object({
    tipo: z.literal("VOTO_REGISTRADO"),
    dados: z.object({ rodadaId: z.uuid(), participanteId: z.uuid() }),
  }),
  z.object({ tipo: z.literal("RODADA_REVELADA"), dados: rodada }),
]);
export type EventoSala = z.infer<typeof eventoSala>;

// ---- Códigos de status que o front precisa conhecer ------------------------

export const STATUS_RODADA = { votando: "VOTING", revelada: "REVEALED" } as const;
