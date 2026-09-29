import { ComoFunciona } from "@/components/home/como-funciona";
import { FormCriarSala } from "@/components/home/form-criar-sala";
import { FormEntrarSala } from "@/components/home/form-entrar-sala";
import { LequeDeCartas } from "@/components/home/leque-de-cartas";
import { Logo } from "@/components/marca/logo";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-280 gap-20 px-6 pt-8 pb-24 sm:gap-28 sm:px-12">
      <header>
        <Logo />
      </header>

      <section className="grid items-center gap-12 lg:grid-cols-12">
        <div className="grid gap-6 lg:col-span-7">
          <h1 className="text-[2.5rem] leading-[1.02] font-[650] tracking-[-0.03em] font-stretch-90% sm:text-6xl">
            Estime em segredo.
            <br />
            Revele junto.
          </h1>
          <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-nanquim/80">
            Planning Poker para times que não querem se influenciar. Cada um
            escolhe uma carta, e ninguém vê nada até todo mundo virar ao mesmo
            tempo.
          </p>
        </div>
        <div className="lg:col-span-5">
          <LequeDeCartas />
        </div>
      </section>

      <section className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="grid gap-7 rounded-painel bg-folha p-6 sm:p-9 lg:col-span-7">
          <h2 className="text-[1.375rem] font-semibold tracking-[-0.015em]">
            Criar uma sala
          </h2>
          <FormCriarSala />
        </div>
        <div className="grid content-start gap-7 lg:col-span-5 lg:pt-9">
          <h2 className="text-[1.375rem] font-semibold tracking-[-0.015em]">
            Entrar com um código
          </h2>
          <FormEntrarSala />
        </div>
      </section>

      <ComoFunciona />
    </main>
  );
}
