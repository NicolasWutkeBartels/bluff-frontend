"use client";

import { FaceCarta, LugarVazio, VersoCarta } from "@/components/carta/carta";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDominio, useHistorico } from "@/lib/consultas";
import { STATUS_RODADA, type Rodada } from "@/lib/esquemas";
import { useState } from "react";

const TODAS = "todas";

/**
 * Histórico da sala. O filtro vem de GET /dominios?dominio=RODADA e envia o código
 * do status (VOTING, REVEALED), nunca o id. Os valores dos votos só aparecem nas rodadas
 * reveladas: é o back que garante isso.
 */
export function Historico({ codigoSala }: { codigoSala: string }) {
  const [filtro, setFiltro] = useState(TODAS);
  const statusDeRodada = useDominio("RODADA");
  const historico = useHistorico(codigoSala, filtro === TODAS ? "" : filtro);

  return (
    <section aria-labelledby="titulo-historico" className="grid content-start gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="titulo-historico" className="text-[15px] font-[600]">
          Rodadas
        </h2>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger size="sm" aria-label="Filtrar rodadas" className="w-auto min-w-32 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectItem value={TODAS}>Todas</SelectItem>
            {statusDeRodada.data?.map((status) => (
              <SelectItem key={status.codigo} value={status.codigo}>
                {status.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {historico.isPending ? (
        <p className="text-[13px] text-musgo">Carregando rodadas…</p>
      ) : historico.isError ? (
        <p className="text-[13px] text-musgo">Não deu para carregar as rodadas. Recarregue a página para tentar de novo.</p>
      ) : historico.data.length === 0 ? (
        <div className="flex items-center gap-4">
          <LugarVazio tamanho="mini" />
          <p className="text-[13px] text-musgo">
            {filtro === TODAS ? "As rodadas aparecem aqui assim que começarem." : "Nenhuma rodada com este status."}
          </p>
        </div>
      ) : (
        <ol className="grid gap-5">
          {historico.data.map((rodada) => (
            <ItemHistorico key={rodada.id} rodada={rodada} codigoSala={codigoSala} />
          ))}
        </ol>
      )}
    </section>
  );
}

function ItemHistorico({ rodada, codigoSala }: { rodada: Rodada; codigoSala: string }) {
  const revelada = rodada.status.codigo === STATUS_RODADA.revelada;
  const valores = rodada.votos.map((v) => v.valor).filter((v): v is string => v !== null);

  return (
    <li className="flex items-start gap-4">
      {revelada && rodada.estimativaFinal ? (
        <FaceCarta valor={rodada.estimativaFinal} tamanho="mini" />
      ) : revelada ? (
        <LugarVazio tamanho="mini" />
      ) : (
        <VersoCarta semente={codigoSala} tamanho="mini" />
      )}
      <div className="grid min-w-0 gap-1 pt-0.5">
        <p className="truncate text-[15px] leading-snug">{rodada.titulo}</p>
        <p className="algarismos text-[13px] text-musgo">
          {revelada
            ? valores.length
              ? `Votos: ${ordenarCartas(valores).join(", ")}`
              : "Ninguém votou"
            : rodada.status.descricao /* a contagem ao vivo fica na mesa */}
        </p>
      </div>
    </li>
  );
}

/** Números em ordem numérica; o resto (PP, M...) na ordem em que veio. */
function ordenarCartas(valores: string[]) {
  return [...valores].sort((a, b) => Number(a) - Number(b) || 0);
}
