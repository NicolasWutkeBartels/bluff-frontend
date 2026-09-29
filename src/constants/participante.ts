import type { Papel } from "@/schemas/participante.schema";
import type { Option } from "@/types/common";

export const OPCOES_PAPEL: Option<Papel>[] = [
  { value: "VOTANTE", label: "Vou votar" },
  { value: "OBSERVADOR", label: "Só vou assistir" },
];
