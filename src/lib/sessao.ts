export type Sessao = { participanteId: string; apelido: string };

const chaveSessao = (codigoSala: string) =>
  `bluff:sala:${codigoSala.toUpperCase()}`;
const chaveVoto = (rodadaId: string) => `bluff:voto:${rodadaId}`;

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {}
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

export function lerMeuVoto(rodadaId: string) {
  return ler(chaveVoto(rodadaId));
}

export function salvarMeuVoto(rodadaId: string, valor: string | null) {
  gravar(chaveVoto(rodadaId), valor);
}
