"use client";

import { Check, Link2, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { VersoCarta } from "@/components/carta/verso-carta";
import { MarcaBluff } from "@/components/marca/marca-bluff";
import { Button } from "@/components/ui/button";
import type { EstadoConexao } from "@/hooks/use-sala-ao-vivo";
import type { Handler } from "@/types/common";

import { IndicadorConexao } from "./indicador-conexao";

type Props = {
  codigo: string;
  nome: string;
  conexao: EstadoConexao;
  onLeave: Handler;
};

export function CabecalhoSala({ codigo, nome, conexao, onLeave }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  async function copiarConvite() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    } catch {}
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/"
          aria-label="Voltar para o início"
          className="rounded-[0.1875rem]"
        >
          <MarcaBluff />
        </Link>
        <div className="grid min-w-0 gap-1">
          <h1 className="truncate text-[1.75rem] leading-tight font-semibold tracking-tight font-stretch-90% sm:text-[2.125rem]">
            {nome}
          </h1>
          <div className="flex items-center gap-2 text-[0.8125rem] text-musgo">
            <VersoCarta
              seed={codigo}
              size="mini"
              className="w-3.5 rounded-xs shadow-none"
            />
            <span className="algarismos font-semibold tracking-[0.12em] text-nanquim font-stretch-85%">
              {codigo}
            </span>
            <Button
              variant="fantasma"
              size="compacto"
              onClick={copiarConvite}
              className="-my-2 h-8 px-2"
            >
              {isCopied ? <Check aria-hidden /> : <Link2 aria-hidden />}
              {isCopied ? "Link copiado" : "Copiar convite"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-5 pl-9 sm:w-auto sm:pl-0">
        <IndicadorConexao conexao={conexao} />
        <Button variant="fantasma" size="compacto" onClick={onLeave}>
          <LogOut aria-hidden />
          Sair da sala
        </Button>
      </div>
    </header>
  );
}
