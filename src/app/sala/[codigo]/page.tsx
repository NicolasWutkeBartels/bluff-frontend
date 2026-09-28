"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useSyncExternalStore } from "react";

import { LugarVazio, VersoCarta } from "@/components/carta/carta";
import { Logo } from "@/components/marca/logo";
import { EntradaNaSala } from "@/components/sala/entrada-na-sala";
import { TelaSala } from "@/components/sala/tela-sala";
import { buttonVariants } from "@/components/ui/button";
import { lerErro } from "@/lib/api";
import { useSalaAoVivo } from "@/lib/ao-vivo";
import { useSala } from "@/lib/consultas";
import { esquecerSessao, lerSessao, type Sessao } from "@/lib/sessao";

/** true no navegador, false na renderização do servidor (onde não existe localStorage). */
const useNoNavegador = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export default function PaginaSala({ params }: PageProps<"/sala/[codigo]">) {
  const codigo = use(params).codigo.toUpperCase();
  const router = useRouter();
  const noNavegador = useNoNavegador();
  const sala = useSala(codigo);

  // Sessão escolhida nesta visita (ao entrar pelo convite); se não houver, vale a salva no navegador.
  const [sessaoNova, setSessaoNova] = useState<Sessao | null>(null);
  const sessaoSalva = noNavegador ? lerSessao(codigo) : null;
  const sessao = sessaoNova ?? sessaoSalva;

  // A sessão só vale se o participante ainda existir na sala.
  const participa = Boolean(sessao && sala.data?.participantes.some((p) => p.id === sessao.participanteId));
  const conexao = useSalaAoVivo(codigo, participa && sessao ? sessao.participanteId : null);

  function sair() {
    esquecerSessao(codigo);
    router.push("/");
  }

  if (!noNavegador || sala.isPending) {
    return <Carregando codigo={codigo} />;
  }

  if (sala.isError) {
    const naoExiste = isAxiosError(sala.error) && sala.error.response?.status === 404;
    return (
      <Aviso
        titulo={naoExiste ? "Esta sala não existe" : "Não deu para abrir a sala"}
        texto={
          naoExiste
            ? `Não encontramos a sala ${codigo}. Confira o código com quem te convidou ou crie uma sala nova.`
            : lerErro(sala.error).mensagem
        }
      />
    );
  }

  if (!participa || !sessao) {
    return <EntradaNaSala codigo={codigo} nome={sala.data.nome} aoEntrar={setSessaoNova} />;
  }

  return <TelaSala sala={sala.data} sessao={sessao} conexao={conexao} aoSair={sair} />;
}

function Carregando({ codigo }: { codigo: string }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="grid justify-items-center gap-4">
        <div className="animate-espera">
          <VersoCarta semente={codigo} tamanho="mesa" />
        </div>
        <p className="text-[13px] text-musgo">Abrindo a sala {codigo}…</p>
      </div>
    </main>
  );
}

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="mx-auto grid w-full max-w-[1120px] gap-16 px-6 pt-8 pb-24 sm:px-12">
      <header>
        <Logo />
      </header>
      <section className="grid max-w-md gap-6">
        <LugarVazio tamanho="mesa" />
        <h1 className="text-[30px] leading-tight font-[650] tracking-[-0.025em] [font-stretch:90%]">{titulo}</h1>
        <p className="text-[15px] leading-relaxed text-nanquim/80">{texto}</p>
        <Link href="/" className={buttonVariants({ variant: "quieto", className: "w-fit" })}>
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
