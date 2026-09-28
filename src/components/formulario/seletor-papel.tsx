"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Papel } from "@/lib/esquemas";

const opcoes: { valor: Papel; rotulo: string }[] = [
  { valor: "VOTANTE", rotulo: "Vou votar" },
  { valor: "OBSERVADOR", rotulo: "Só vou assistir" },
];

/** Controle segmentado de duas opções (ToggleGroup do shadcn, reestilizado). */
export function SeletorPapel({ valor, aoMudar }: { valor: Papel; aoMudar: (papel: Papel) => void }) {
  return (
    <div className="grid gap-2">
      <Label asChild>
        <span id="rotulo-papel">Como você participa</span>
      </Label>
      <ToggleGroup
        type="single"
        value={valor}
        onValueChange={(novo) => novo && aoMudar(novo as Papel)}
        aria-labelledby="rotulo-papel"
        spacing={0}
        className="w-full rounded-controle bg-nanquim/[0.05] p-1"
      >
        {opcoes.map((opcao) => (
          <ToggleGroupItem
            key={opcao.valor}
            value={opcao.valor}
            className="h-9 flex-1 rounded-[7px]! px-3 text-sm text-musgo transition-colors duration-150 ease-suave hover:bg-transparent hover:text-nanquim data-[state=on]:bg-papel data-[state=on]:text-nanquim"
          >
            {opcao.rotulo}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
