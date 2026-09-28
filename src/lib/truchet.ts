/*
 * O verso das cartas do Bluff é um ladrilho de Truchet: cada casa de uma grade recebe
 * dois arcos de quarto de círculo, em uma de duas orientações. Casas vizinhas se encaixam
 * e formam curvas contínuas.
 *
 * A orientação de cada casa vem de um gerador pseudoaleatório semeado pelo código da sala,
 * então o mesmo código sempre produz o mesmo verso, e cada sala tem o seu.
 */

/** Hash de texto para número (FNV-1a de 32 bits). */
function hash(texto: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Gerador pseudoaleatório pequeno e determinístico (mulberry32). */
function geradorAleatorio(semente: number) {
  let estado = semente;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Caminho SVG (atributo `d`) do padrão, numa grade de `colunas` × `linhas` casas de `lado` unidades.
 * Cada casa desenha dois arcos que ligam os pontos médios de lados vizinhos.
 */
export function caminhoTruchet(semente: string, colunas: number, linhas: number, lado = 10) {
  const aleatorio = geradorAleatorio(hash(semente));
  const r = lado / 2;
  const partes: string[] = [];

  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = coluna * lado;
      const y = linha * lado;
      if (aleatorio() < 0.5) {
        // arcos nos cantos superior esquerdo e inferior direito
        partes.push(`M${x + r} ${y}A${r} ${r} 0 0 1 ${x} ${y + r}`);
        partes.push(`M${x + lado} ${y + r}A${r} ${r} 0 0 0 ${x + r} ${y + lado}`);
      } else {
        // arcos nos cantos superior direito e inferior esquerdo
        partes.push(`M${x + r} ${y}A${r} ${r} 0 0 0 ${x + lado} ${y + r}`);
        partes.push(`M${x} ${y + r}A${r} ${r} 0 0 1 ${x + r} ${y + lado}`);
      }
    }
  }
  return partes.join("");
}
