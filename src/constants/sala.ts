export const CODIGO_SALA_REGEX = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

export const STATUS_RODADA = {
  votando: "VOTING",
  revelada: "REVEALED",
} as const;

export const DOMINIO_RODADA = "RODADA";
