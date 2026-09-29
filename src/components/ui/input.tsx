import * as React from "react";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-controle border border-transparent bg-nanquim/5 px-3.5 text-[0.9375rem] text-nanquim transition-colors duration-150 ease-suave outline-none placeholder:text-musgo/80 hover:bg-nanquim/7 focus-visible:border-nanquim/60 focus-visible:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-caqui/70",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
