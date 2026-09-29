"use client";

import { useState } from "react";

import { LugarVazio } from "@/components/carta/lugar-vazio";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOMINIO_RODADA } from "@/constants/sala";
import { useDominio } from "@/hooks/use-dominio";
import { useHistorico } from "@/hooks/use-rodada";

import { ItemHistorico } from "./item-historico";

const TODAS = "todas";

export function Historico({ codigoSala }: { codigoSala: string }) {
  const [filtro, setFiltro] = useState(TODAS);
  const statusDeRodada = useDominio(DOMINIO_RODADA);
  const historico = useHistorico(codigoSala, filtro === TODAS ? "" : filtro);

  return (
    <section
      aria-labelledby="titulo-historico"
      className="grid content-start gap-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="titulo-historico" className="text-[0.9375rem] font-semibold">
          Rodadas
        </h2>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger
            size="sm"
            aria-label="Filtrar rodadas"
            className="w-auto min-w-28 bg-transparent"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectGroup>
              <SelectItem value={TODAS}>Todas</SelectItem>
              {statusDeRodada.data?.map((status) => (
                <SelectItem key={status.codigo} value={status.codigo}>
                  {status.descricao}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {historico.isPending ? (
        <p className="text-[0.8125rem] text-musgo">Carregando rodadas…</p>
      ) : historico.isError ? (
        <p className="text-[0.8125rem] text-musgo">
          Não deu para carregar as rodadas. Recarregue a página para tentar de
          novo.
        </p>
      ) : historico.data.length === 0 ? (
        <div className="flex items-center gap-4">
          <LugarVazio size="mini" />
          <p className="text-[0.8125rem] text-musgo">
            {filtro === TODAS
              ? "As rodadas aparecem aqui assim que começarem."
              : "Nenhuma rodada com este status."}
          </p>
        </div>
      ) : (
        <ol className="grid gap-5">
          {historico.data.map((rodada) => (
            <ItemHistorico
              key={rodada.id}
              rodada={rodada}
              codigoSala={codigoSala}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
