import { FaceCarta, VersoCarta } from "@/components/carta/carta";
import { SEMENTE_DA_MARCA } from "@/components/marca/logo";

/** Três cartas abertas em leque: duas escondidas e uma revelada. Resume o jogo sem texto. */
export function LequeDeCartas() {
  return (
    <div aria-hidden className="relative mx-auto h-[190px] w-[240px] sm:h-[220px] sm:w-[280px]">
      <div className="absolute top-4 left-2 origin-bottom-right -rotate-[9deg]">
        <VersoCarta semente={SEMENTE_DA_MARCA} tamanho="vitrine" />
      </div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 origin-bottom -rotate-[1deg]">
        <VersoCarta semente="REVELE" tamanho="vitrine" />
      </div>
      <div className="absolute top-4 right-2 origin-bottom-left rotate-[8deg]">
        <FaceCarta valor="8" tamanho="vitrine" />
      </div>
    </div>
  );
}
