import axios, { isAxiosError } from "axios";
import { z } from "zod";

import {
  baralho,
  entrada,
  estadoSala,
  itemDominio,
  rodada,
  type FormCriarSala,
  type Papel,
} from "./esquemas";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Mesmo servidor da API, trocando http(s) por ws(s). */
export const WS_URL = API_URL.replace(/^http/, "ws") + "/ws";

const http = axios.create({ baseURL: API_URL, timeout: 10_000 });

/** Sem login: o id do participante, recebido ao entrar na sala, identifica quem age. */
const comParticipante = (participanteId: string) => ({ headers: { "X-Participante-Id": participanteId } });

// ---- Leitura ---------------------------------------------------------------

export async function buscarDominio(dominio: string) {
  const { data } = await http.get("/dominios", { params: { dominio } });
  return z.array(itemDominio).parse(data);
}

export async function buscarBaralhos() {
  const { data } = await http.get("/baralhos");
  return z.array(baralho).parse(data);
}

export async function buscarSala(codigo: string) {
  const { data } = await http.get(`/salas/${codigo}`);
  return estadoSala.parse(data);
}

/** `status` é o código do status (ex.: REVEALED), nunca o id. */
export async function buscarHistorico(codigo: string, status?: string) {
  const { data } = await http.get(`/salas/${codigo}/rodadas`, { params: status ? { status } : {} });
  return z.array(rodada).parse(data);
}

// ---- Ações -----------------------------------------------------------------

export async function criarSala(form: FormCriarSala) {
  const { data } = await http.post("/salas", form);
  return entrada.parse(data);
}

export async function entrarNaSala(codigo: string, apelido: string, papel: Papel) {
  const { data } = await http.post(`/salas/${codigo}/participantes`, { apelido, papel });
  return entrada.parse(data);
}

export async function iniciarRodada(codigo: string, participanteId: string, titulo: string) {
  const { data } = await http.post(`/salas/${codigo}/rodadas`, { titulo }, comParticipante(participanteId));
  return rodada.parse(data);
}

/** Responde 204 sem corpo: nem o próprio voto volta enquanto a rodada está aberta. */
export async function votar(rodadaId: string, participanteId: string, valor: string) {
  await http.post(`/rodadas/${rodadaId}/votos`, { valor }, comParticipante(participanteId));
}

export async function revelar(rodadaId: string, participanteId: string, estimativaFinal?: string) {
  const { data } = await http.post(
    `/rodadas/${rodadaId}/revelar`,
    { estimativaFinal: estimativaFinal || null },
    comParticipante(participanteId),
  );
  return rodada.parse(data);
}

// ---- Erros -----------------------------------------------------------------

const problema = z.object({
  detail: z.string().optional(),
  codigo: z.string().optional(),
  campos: z.record(z.string(), z.string()).optional(),
});

export type ErroApi = { mensagem: string; codigo?: string; campos?: Record<string, string> };

/**
 * Transforma qualquer falha numa mensagem para a pessoa. O back já manda mensagens em
 * português no campo `detail` (formato RFC 9457); aqui só cobrimos os casos em que nem
 * chegou resposta.
 */
export function lerErro(erro: unknown): ErroApi {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return { mensagem: "Não conseguimos falar com o servidor. Confira sua conexão e tente de novo." };
    }
    const corpo = problema.safeParse(erro.response.data);
    if (corpo.success && corpo.data.detail) {
      return { mensagem: corpo.data.detail, codigo: corpo.data.codigo, campos: corpo.data.campos };
    }
  }
  return { mensagem: "Algo deu errado. Tente de novo em alguns instantes." };
}
