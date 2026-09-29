import { VersoCarta } from "@/components/carta/verso-carta";

export function SalaCarregando({ codigo }: { codigo: string }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="grid justify-items-center gap-4">
        <div className="animate-espera">
          <VersoCarta seed={codigo} size="mesa" />
        </div>
        <p className="text-[0.8125rem] text-musgo">Abrindo a sala {codigo}…</p>
      </div>
    </main>
  );
}
