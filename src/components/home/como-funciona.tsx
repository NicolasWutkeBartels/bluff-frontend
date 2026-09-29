"use client";

import { motion } from "motion/react";

import { FaceCarta } from "@/components/carta/face-carta";
import { VersoCarta } from "@/components/carta/verso-carta";
import { transicao } from "@/constants/animacao";

const etapas = [
  {
    carta: <VersoCarta seed="ESCOLHA" size="mesa" />,
    texto: "Cada pessoa escolhe uma carta, sem mostrar a ninguém.",
  },
  {
    carta: <VersoCarta seed="SEGREDO" size="mesa" />,
    texto: "A mesa mostra quem já votou, nunca o valor.",
  },
  {
    carta: <FaceCarta value="5" size="mesa" />,
    texto: "Todos viram as cartas ao mesmo tempo. Aí começa a conversa.",
  },
];

export function ComoFunciona() {
  return (
    <section aria-labelledby="como-funciona" className="grid gap-10">
      <h2
        id="como-funciona"
        className="text-[1.375rem] font-semibold tracking-[-0.015em]"
      >
        Como uma rodada acontece
      </h2>
      <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {etapas.map((etapa, index) => (
          <motion.li
            key={index}
            className="grid max-w-[30ch] gap-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...transicao.padrao, delay: index * 0.08 }}
          >
            {etapa.carta}
            <p className="text-[0.9375rem] leading-relaxed text-nanquim/85">
              {etapa.texto}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
