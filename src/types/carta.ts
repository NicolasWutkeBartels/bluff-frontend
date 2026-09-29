import type { WithClassName } from "./common";

export type TamanhoCarta = "mini" | "mesa" | "mao" | "vitrine";

export type CartaProps<P = object> = WithClassName<P & { size: TamanhoCarta }>;
