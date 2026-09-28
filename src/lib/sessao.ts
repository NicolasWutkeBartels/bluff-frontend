/*
 * O que o navegador lembra entre recargas. Sem login, o id do participante é a "chave"
 * da pessoa na sala: quem tiver esse UUID age como ela. Por isso ele fica só neste navegador.
 */

export type Sessao = { participanteId: string; apelido: string };

const chaveSessao = (codigoSala: string) => `bluff:sala:${codigoSala.toUpperCase()}`;
const chaveVoto = (rodadaId: string) => `bluff:voto:${rodadaId}`;

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null; // navegação privada ou armazenamento bloqueado
  }
}

function gravar(chave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    // Sem armazenamento, a sessão dura só até recarregar a página.
  }
}

export function lerSessao(codigoSala: string): Sessao | null {
  const bruto = ler(chaveSessao(codigoSala));
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as Sessao;
  } catch {
    return null;
  }
}

export function salvarSessao(codigoSala: string, sessao: Sessao) {
  gravar(chaveSessao(codigoSala), JSON.stringify(sessao));
}

export function esquecerSessao(codigoSala: string) {
  gravar(chaveSessao(codigoSala), null);
}

/**
 * A API nunca devolve o valor de um voto antes da revelação, nem para quem votou.
 * Guardamos a própria carta aqui para mostrá-la de novo se a página recarregar.
 */
export function lerMeuVoto(rodadaId: string) {
  return ler(chaveVoto(rodadaId));
}

export function salvarMeuVoto(rodadaId: string, valor: string | null) {
  gravar(chaveVoto(rodadaId), valor);
}
