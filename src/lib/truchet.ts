function hash(texto: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function geradorAleatorio(seed: number) {
  let estado = seed;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function caminhoTruchet(
  seed: string,
  colunas: number,
  linhas: number,
  lado = 10,
) {
  const aleatorio = geradorAleatorio(hash(seed));
  const r = lado / 2;
  const partes: string[] = [];

  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = coluna * lado;
      const y = linha * lado;
      if (aleatorio() < 0.5) {
        partes.push(`M${x + r} ${y}A${r} ${r} 0 0 1 ${x} ${y + r}`);
        partes.push(
          `M${x + lado} ${y + r}A${r} ${r} 0 0 0 ${x + r} ${y + lado}`,
        );
      } else {
        partes.push(`M${x + r} ${y}A${r} ${r} 0 0 0 ${x + lado} ${y + r}`);
        partes.push(`M${x} ${y + r}A${r} ${r} 0 0 1 ${x + r} ${y + lado}`);
      }
    }
  }
  return partes.join("");
}
