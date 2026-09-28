import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/*
 * Botão do shadcn reestilizado pelos tokens do Bluff:
 * raio de controle (10px), sem sombra, clique com escala 0.98.
 * - principal: a ação mais importante da tela. É o único botão com o acento (caqui).
 * - quieto: ações secundárias, no tom das superfícies.
 * - fantasma: ações de apoio (copiar código, sair).
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-controle font-medium whitespace-nowrap select-none transition-[background-color,color,opacity,transform] duration-150 ease-suave active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:stroke-[1.5]",
  {
    variants: {
      variant: {
        principal: "bg-caqui text-sobre-caqui hover:bg-caqui/90",
        quieto: "bg-nanquim/[0.06] text-nanquim hover:bg-nanquim/10",
        fantasma: "text-musgo hover:bg-nanquim/[0.06] hover:text-nanquim",
      },
      size: {
        padrao: "h-11 px-5 text-[15px]",
        compacto: "h-9 px-3 text-sm",
        icone: "size-9",
      },
    },
    defaultVariants: {
      variant: "principal",
      size: "padrao",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
