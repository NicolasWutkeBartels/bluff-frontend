import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const WS_URL = API_URL.replace(/^http/, "ws") + "/ws";

export const apiClient = axios.create({ baseURL: API_URL, timeout: 10_000 });

export const comParticipante = (participanteId: string) => ({
  headers: { "X-Participante-Id": participanteId },
});
