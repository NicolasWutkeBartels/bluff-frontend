"use client";

import { Check, Link2, LogOut } from "lucide-react";
import { useState } from "react";

import { VersoCarta } from "@/components/carta/carta";
import { MarcaBluff } from "@/components/marca/logo";
import { Button } from "@/components/ui/button";
import type { EstadoConexao } from "@/lib/ao-vivo";
import Link from "next/link";

import { IndicadorConexao } from "./indicador-conexao";

type Props = {
  codigo: string;
  nome: string;
  conexao: EstadoConexao;
  aoSair: () => void;
};

export function CabecalhoSala({ codigo, nome, conexao, aoSair }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiarConvite() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      // Sem permissão de área de transferência: o código continua visível para copiar à mão.
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-4">
        <Link href="/" aria-label="Voltar para o início" className="rounded-[3px]">
          <MarcaBluff />
        </Link>
        <div className="grid min-w-0 gap-1">
          <h1 className="truncate text-[28px] leading-tight font-[650] tracking-[-0.025em] [font-stretch:90%] sm:text-[34px]">
            {nome}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-musgo">
            <VersoCarta semente={codigo} tamanho="mini" className="w-3.5 rounded-[2px] shadow-none" />
            <span className="algarismos font-[600] tracking-[0.12em] text-nanquim [font-stretch:85%]">{codigo}</span>
            <Button variant="fantasma" size="compacto" onClick={copiarConvite} className="-my-2 h-8 px-2">
              {copiado ? <Check aria-hidden /> : <Link2 aria-hidden />}
              {copiado ? "Link copiado" : "Copiar convite"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <IndicadorConexao estado={conexao} />
        <Button variant="fantasma" size="compacto" onClick={aoSair}>
          <LogOut aria-hidden />
          Sair da sala
        </Button>
      </div>
    </header>
  );
}
