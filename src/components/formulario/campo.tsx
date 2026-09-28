import { cn } from "cn";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { z } from "zod";

import { Label } from "@/components/ui/label";

/** Rótulo + controle + mensagem de erro. O id liga o rótulo e o erro ao campo (acessibilidade). */
export function Campo({
  id,
  rotulo,
  erro,
  children,
  className,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{rotulo}</Label>
      {children}
      {erro && <MensagemErro id={`${id}-erro`}>{erro}</MensagemErro>}
    </div>
  );
}

/**
 * Texto em nanquim (o caqui não tem contraste suficiente para texto pequeno);
 * o ícone em caqui é o que chama a atenção.
 */
export function MensagemErro({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-[13px] leading-snug text-nanquim">
      <CircleAlert className="mt-px size-3.5 shrink-0 stroke-[1.75] text-caqui" aria-hidden />
      {children}
    </p>
  );
}

/** Erros do Zod como { campo: mensagem }, ficando com a primeira mensagem de cada campo. */
export function errosPorCampo(erro: z.ZodError): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "");
    erros[campo] ??= problema.message;
  }
  return erros;
}

/** Props de acessibilidade para um campo que pode ter erro. */
export function ariaDoCampo(id: string, erro?: string) {
  return { id, "aria-invalid": erro ? true : undefined, "aria-describedby": erro ? `${id}-erro` : undefined };
}
