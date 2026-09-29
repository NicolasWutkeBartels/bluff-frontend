import * as React from "react";
import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-controle border border-transparent bg-nanquim/5 px-3.5 py-3 text-[0.9375rem] leading-relaxed text-nanquim transition-colors duration-150 ease-suave outline-none placeholder:text-musgo/80 hover:bg-nanquim/7 focus-visible:border-nanquim/60 focus-visible:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-caqui/70",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
