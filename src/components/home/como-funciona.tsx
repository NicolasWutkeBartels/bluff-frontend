"use client";

import { motion } from "motion/react";

import { FaceCarta, VersoCarta } from "@/components/carta/carta";
import { transicao } from "@/lib/movimento";

const etapas = [
  { carta: <VersoCarta semente="ESCOLHA" tamanho="mesa" />, texto: "Cada pessoa escolhe uma carta, sem mostrar a ninguém." },
  { carta: <VersoCarta semente="SEGREDO" tamanho="mesa" />, texto: "A mesa mostra quem já votou, nunca o valor." },
  { carta: <FaceCarta valor="5" tamanho="mesa" />, texto: "Todos viram as cartas ao mesmo tempo. Aí começa a conversa." },
];

/**
 * Único lugar do app com revelação ao rolar (whileInView): cada etapa surge uma vez,
 * com fade e 8 px de deslocamento, quando entra na tela.
 */
export function ComoFunciona() {
  return (
    <section aria-labelledby="como-funciona" className="grid gap-10">
      <h2 id="como-funciona" className="text-[22px] font-[600] tracking-[-0.015em]">
        Como uma rodada acontece
      </h2>
      <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {etapas.map((etapa, indice) => (
          <motion.li
            key={indice}
            className="grid max-w-[30ch] gap-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...transicao.padrao, delay: indice * 0.08 }}
          >
            {etapa.carta}
            <p className="text-[15px] leading-relaxed text-nanquim/85">{etapa.texto}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
