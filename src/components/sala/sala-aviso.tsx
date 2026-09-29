import Link from "next/link";

import { LugarVazio } from "@/components/carta/lugar-vazio";
import { Logo } from "@/components/marca/logo";
import { buttonVariants } from "@/components/ui/button";

type Props = { title: string; description: string };

export function SalaAviso({ title, description }: Props) {
  return (
    <main className="mx-auto grid w-full max-w-280 gap-16 px-6 pt-8 pb-24 sm:px-12">
      <header>
        <Logo />
      </header>
      <section className="grid max-w-md gap-6">
        <LugarVazio size="mesa" />
        <h1 className="text-3xl leading-tight font-[650] tracking-tight font-stretch-90%">
          {title}
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-nanquim/80">
          {description}
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: "quieto", className: "w-fit" })}
        >
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
