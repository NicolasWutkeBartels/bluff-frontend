"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { EntradaNaSala } from "@/components/sala/entrada-na-sala";
import { SalaAviso } from "@/components/sala/sala-aviso";
import { SalaCarregando } from "@/components/sala/sala-carregando";
import { TelaSala } from "@/components/sala/tela-sala";
import { useNoNavegador } from "@/hooks/use-no-navegador";
import { useSala } from "@/hooks/use-sala";
import { useSalaAoVivo } from "@/hooks/use-sala-ao-vivo";
import { esquecerSessao, lerSessao, type Sessao } from "@/lib/sessao";
import { ehNaoEncontrado, lerErroApi } from "@/services/api-erro";
import type { Nullable } from "@/types/common";

export default function SalaPage({ params }: PageProps<"/sala/[codigo]">) {
  const codigo = use(params).codigo.toUpperCase();
  const router = useRouter();
  const noNavegador = useNoNavegador();
  const sala = useSala(codigo);

  const [sessaoNova, setSessaoNova] = useState<Nullable<Sessao>>(null);
  const sessaoSalva = noNavegador ? lerSessao(codigo) : null;
  const sessao = sessaoNova ?? sessaoSalva;

  const participa = Boolean(
    sessao &&
    sala.data?.participantes.some((p) => p.id === sessao.participanteId),
  );
  const conexao = useSalaAoVivo(
    codigo,
    participa && sessao ? sessao.participanteId : null,
  );

  function sair() {
    esquecerSessao(codigo);
    router.push("/");
  }

  if (!noNavegador || sala.isPending) {
    return <SalaCarregando codigo={codigo} />;
  }

  if (sala.isError) {
    const naoExiste = ehNaoEncontrado(sala.error);
    return (
      <SalaAviso
        title={naoExiste ? "Esta sala não existe" : "Não deu para abrir a sala"}
        description={
          naoExiste
            ? `Não encontramos a sala ${codigo}. Confira o código com quem te convidou ou crie uma sala nova.`
            : lerErroApi(sala.error).mensagem
        }
      />
    );
  }

  if (!participa || !sessao) {
    return (
      <EntradaNaSala
        codigo={codigo}
        nome={sala.data.nome}
        onEnter={setSessaoNova}
      />
    );
  }

  return (
    <TelaSala
      sala={sala.data}
      sessao={sessao}
      conexao={conexao}
      onLeave={sair}
    />
  );
}
