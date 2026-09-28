import * as React from "react"
import { cn } from "cn"

/** Campo como um "poço" levemente mais escuro que a superfície, sem sombra. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-controle border border-transparent bg-nanquim/[0.05] px-3.5 text-[15px] text-nanquim transition-colors duration-150 ease-suave outline-none placeholder:text-musgo/80 hover:bg-nanquim/[0.07] focus-visible:border-nanquim/60 focus-visible:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-caqui/70",
        className
      )}
      {...props}
    />
  )
}

export { Input }
