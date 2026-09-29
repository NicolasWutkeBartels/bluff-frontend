import { isAxiosError } from "axios";
import { z } from "zod";

const problemaSchema = z.object({
  detail: z.string().optional(),
  codigo: z.string().optional(),
  campos: z.record(z.string(), z.string()).optional(),
});

export type ErroApi = {
  mensagem: string;
  codigo?: string;
  campos?: Record<string, string>;
};

export function lerErroApi(erro: unknown): ErroApi {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return {
        mensagem:
          "Não conseguimos falar com o servidor. Confira sua conexão e tente de novo.",
      };
    }
    const corpo = problemaSchema.safeParse(erro.response.data);
    if (corpo.success && corpo.data.detail) {
      return {
        mensagem: corpo.data.detail,
        codigo: corpo.data.codigo,
        campos: corpo.data.campos,
      };
    }
  }
  return { mensagem: "Algo deu errado. Tente de novo em alguns instantes." };
}

export function ehNaoEncontrado(erro: unknown) {
  return isAxiosError(erro) && erro.response?.status === 404;
}
