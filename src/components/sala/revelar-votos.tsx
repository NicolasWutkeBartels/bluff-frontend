"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevelarRodada } from "@/hooks/use-rodada";
import { lerErroApi } from "@/services/api-erro";
import type { ParticipanteNaSala } from "@/types/sala";

const SEM_ESTIMATIVA = "sem-estimativa";

type Props = ParticipanteNaSala<{ cartas: string[]; rodadaId: string }>;

export function RevelarVotos({ cartas, rodadaId, ...participante }: Props) {
  const [estimativa, setEstimativa] = useState(SEM_ESTIMATIVA);
  const revelacao = useRevelarRodada(participante);

  function revelar() {
    revelacao.mutate({
      rodadaId,
      estimativaFinal: estimativa === SEM_ESTIMATIVA ? undefined : estimativa,
    });
  }

  return (
    <div className="grid justify-items-start gap-3 sm:justify-items-end">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={estimativa} onValueChange={setEstimativa}>
          <SelectTrigger
            size="sm"
            aria-label="Estimativa final"
            className="w-auto min-w-40"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectGroup>
              <SelectItem value={SEM_ESTIMATIVA}>
                Sem estimativa final
              </SelectItem>
              {cartas.map((carta) => (
                <SelectItem key={carta} value={carta}>
                  Estimativa final: {carta}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={revelar} disabled={revelacao.isPending}>
          {revelacao.isPending ? "Revelando…" : "Revelar votos"}
        </Button>
      </div>
      {revelacao.isError && (
        <FieldError>{lerErroApi(revelacao.error).mensagem}</FieldError>
      )}
    </div>
  );
}
