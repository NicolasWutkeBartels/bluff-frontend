import { FaceCarta } from "@/components/carta/face-carta";
import { VersoCarta } from "@/components/carta/verso-carta";
import { STATUS_RODADA } from "@/constants/sala";
import type { Rodada } from "@/schemas/rodada.schema";

type Props = { rodada: Rodada; codigoSala: string };

export function ItemHistorico({ rodada, codigoSala }: Props) {
  const revelada = rodada.status.codigo === STATUS_RODADA.revelada;
  const valores = rodada.votos
    .map((v) => v.valor)
    .filter((v): v is string => v !== null);

  return (
    <li className="flex items-start gap-4">
      {revelada && rodada.estimativaFinal ? (
        <FaceCarta value={rodada.estimativaFinal} size="mini" />
      ) : revelada ? (
        <FaceCarta value="–" size="mini" />
      ) : (
        <VersoCarta seed={codigoSala} size="mini" />
      )}
      <div className="grid min-w-0 gap-1 pt-0.5">
        <p className="truncate text-[0.9375rem] leading-snug">
          {rodada.titulo}
        </p>
        <p className="algarismos text-[0.8125rem] text-musgo">
          {revelada
            ? valores.length
              ? `Votos: ${ordenarCartas(valores).join(", ")}`
              : "Ninguém votou"
            : rodada.status.descricao}
        </p>
      </div>
    </li>
  );
}

function ordenarCartas(valores: string[]) {
  return [...valores].sort((a, b) => Number(a) - Number(b) || 0);
}
