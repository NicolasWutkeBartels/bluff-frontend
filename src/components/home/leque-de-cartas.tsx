import { FaceCarta } from "@/components/carta/face-carta";
import { VersoCarta } from "@/components/carta/verso-carta";
import { SEMENTE_DA_MARCA } from "@/constants/marca";

export function LequeDeCartas() {
  return (
    <div aria-hidden className="relative mx-auto h-47.5 w-60 sm:h-55 sm:w-70">
      <div className="absolute top-4 left-2 origin-bottom-right -rotate-9">
        <VersoCarta seed={SEMENTE_DA_MARCA} size="vitrine" />
      </div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 origin-bottom -rotate-1">
        <VersoCarta seed="REVELE" size="vitrine" />
      </div>
      <div className="absolute top-4 right-2 origin-bottom-left rotate-8">
        <FaceCarta value="8" size="vitrine" />
      </div>
    </div>
  );
}
