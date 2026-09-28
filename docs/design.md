# Plano de design do Bluff

O Bluff é um jogo de cartas em que ninguém vê a carta dos outros até a revelação.
O visual existe para servir a esse momento: **a carta** e **a revelação**. Todo o resto fica quieto.

---

## 1. Dois conceitos

### Conceito A: "Mesa de feltro" (descartado)

Fundo verde-feltro escuro, cartas brancas com sombra forte, fichas coloridas como indicador
de quem votou, fonte com serifa para os números, um dourado como acento.
A revelação seria uma animação de "dealer" distribuindo as cartas.

### Conceito B: "O verso é a identidade" (escolhido)

Cada sala tem **um verso de carta próprio**, gerado a partir do código da sala.
O padrão é um **ladrilho de Truchet**: uma grade em que cada casa tem dois arcos de quarto de círculo,
em uma de duas orientações. Juntas, as casas formam curvas contínuas, como um labirinto suave.
A orientação de cada casa vem de um gerador pseudoaleatório semeado pelo código da sala
(`K7PX3M` sempre gera o mesmo verso; `R4TQ9W`, outro).

Esse verso aparece:
- nas cartas viradas para baixo (quem já votou);
- no logo e no favicon (o verso da "sala" `BLUFF`);
- nos estados vazios (uma carta com o verso, sem número);
- no cabeçalho da sala, pequeno, ao lado do código, como um "brasão" da sala.

O segredo ganha forma: enquanto a rodada está em votação, você vê o **padrão**; na revelação,
vê o **número**. O padrão é só traço fino sobre papel; não precisa de cor para ter personalidade.

### Por que o A era mais genérico

O feltro verde é a primeira imagem que qualquer pessoa associa a "poker". Ele comunicaria
"cassino", que nem é o assunto (ninguém aposta nada no Planning Poker), e dependeria de
ornamento (textura de feltro, fichas, sombra pesada) para funcionar. Qualquer app de poker
poderia usá-lo sem mudar nada. O conceito B nasce da regra específica do Bluff (voto secreto
até a revelação) e dá a cada sala algo que só ela tem.

---

## 2. Cor

Base fria e dessaturada, puxada para o verde-acinzentado de folha de eucalipto.
Superfícies em tons vizinhos da base. Um único acento quente, o **caqui**.

| Token      | Papel                                            | Claro     | Escuro    |
|------------|--------------------------------------------------|-----------|-----------|
| `eucalipto`| fundo da página                                  | `#DCE3DE` | `#141B19` |
| `folha`    | superfícies (painéis, campos)                    | `#E8EDE9` | `#1C2522` |
| `papel`    | face da carta (a superfície mais clara)          | `#F6F8F5` | `#26302C` |
| `nanquim`  | texto principal e traço do verso                 | `#18211E` | `#E4EAE6` |
| `musgo`    | texto secundário, bordas finas                   | `#52615B` | `#93A39D` |
| `caqui`    | acento: carta escolhida, ação principal, revelado | `#C8432A` | `#F07252` |

Contrastes calculados (WCAG 2.x), todos acima de 4,5:1 (AA para texto normal):

| Par                                 | Claro  | Escuro |
|-------------------------------------|--------|--------|
| `nanquim` sobre `eucalipto`         | 12,6:1 | 14,3:1 |
| `musgo` sobre `eucalipto`           | 5,0:1  | 6,6:1  |
| `musgo` sobre `folha`               | 5,5:1  | 6,0:1  |
| botão principal: `papel` sobre `caqui` (claro) / `eucalipto` sobre `caqui` (escuro) | 4,6:1 | 6,0:1 |

**Onde o caqui aparece (e só aí):** a carta que você escolheu, o botão da ação principal de cada tela
e o anel de consenso. Se algo novo pedir o acento, alguma dessas três coisas precisa abrir mão dele.

Textura: um grão de papel em SVG (`feTurbulence`) sobre o fundo, com **3% de opacidade**.
Some no modo escuro (lá o grão vira ruído sujo).

---

## 3. Tipografia

**Uma família só: Bricolage Grotesque**, variável, com eixos de peso (`wght`), largura (`wdth`)
e tamanho óptico (`opsz`).

O eixo óptico é o motivo da escolha: a mesma família muda de caráter conforme o tamanho.
Em 15 px ela é calma e legível; em 64 px aparecem as "armadilhas de tinta" e os contrastes
que dão às cartas uma cara de impressão tipográfica. Uma família, dois comportamentos,
sem precisar de uma segunda fonte para ter personalidade.

| Uso                     | Tamanho | Peso | Largura | Extras                     |
|-------------------------|---------|------|---------|----------------------------|
| Valor na carta grande   | 56–64px | 700  | 80      | `tabular-nums`, opsz auto  |
| Valor na carta pequena  | 20px    | 650  | 85      | `tabular-nums`             |
| Nome da sala / título   | 28–40px | 600  | 90      | espaçamento -0,02em        |
| Título da rodada        | 22px    | 550  | 100     |                            |
| Texto                   | 15px    | 400  | 100     | linha ≤ 68 caracteres      |
| Apoio (rótulos, status) | 13px    | 450  | 100     | cor `musgo`, caixa normal  |

Verificado com fontTools: a Bricolage tem a feature `tnum`.
A hierarquia vem de tamanho, peso e largura. Nada de caixa alta espaçada.

---

## 4. Forma

- **Carta:** proporção 5:7 (a de uma carta de baralho, 63 × 88 mm), raio **6 px**, borda de 1 px
  em `musgo` a 35%. É o único elemento com sombra: uma sombra curta, quase uma borda de baixo.
- **Controles** (botões, campos, selects): raio **10 px**, sem sombra.
- **Painéis:** raio **22 px**, sem borda e sem sombra; destacados do fundo só pelo tom (`folha`).
- Nenhum painel dentro de painel. Grupos se separam por espaço (32–64 px), não por linha.

---

## 5. Layout

Grade de 12 colunas, largura máxima de 1120 px, margens de 24 px no celular e 48 px no desktop.

### Home

```
┌──────────────────────────────────────────────────────────────┐
│  [▦] Bluff                                                   │
│                                                              │
│        Estime em segredo.                ┌────┐              │
│        Revele junto.                   ┌─┤▒▒▒▒│ ← leque de   │
│                                        │▒│▒▒▒▒│   3 cartas   │
│        Planning Poker para times      │▒│▒▒▒▒│   com o verso│
│        que não querem se influenciar.  └─┤▒▒▒▒│              │
│                                          └────┘              │
│   ┌─────────────────────────┐   ┌─────────────────────────┐  │
│   │ Criar sala              │   │ Entrar com código       │  │
│   │ nome da sala            │   │ código  [K7PX3M]        │  │
│   │ seu apelido             │   │ seu apelido             │  │
│   │ baralho  [Fibonacci ▾]  │   │ ( votar | só assistir ) │  │
│   │ ( votar | só assistir ) │   │                         │  │
│   │ [Criar sala]            │   │ [Entrar na sala]        │  │
│   └─────────────────────────┘   └─────────────────────────┘  │
│                                                              │
│   Como uma rodada acontece             (rolagem)             │
│   [verso]      [verso]       [ 8 ]                           │
│   Cada um      Ninguém vê    Todos viram                     │
│   escolhe.     nada.         juntos.                         │
└──────────────────────────────────────────────────────────────┘
```

No celular, tudo vira uma coluna: título, leque de cartas menor, os dois formulários.

### Sala

```
┌──────────────────────────────────────────────────────────────┐
│ [▦] Time Azul   [▦] K7PX3M ⧉                  ◦ ao vivo      │
│                                                              │
│  Tela de login                         [Revelar votos]       │
│  3 de 4 já votaram                                           │
│                                                     Rodadas  │
│   ┌───┐  ┌───┐  ┌ ─ ┐  ┌───┐                      anteriores│
│   │▒▒▒│  │▒▒▒│  │   │  │▒▒▒│   ← mesa: uma carta             │
│   │▒▒▒│  │▒▒▒│  │   │  │▒▒▒│     por votante              [8]│
│   └───┘  └───┘  └ ─ ┘  └───┘                    Checkout     │
│    Ana    Bia    Caio   Duda                             [5] │
│                                                    Cadastro  │
│   Observando: Enzo                                           │
│                                                              │
│                                                              │
│   Sua carta                                                  │
│   [1] [2] [3] [5] [8] [13] [21]   ← a mão                    │
└──────────────────────────────────────────────────────────────┘
```

- **Mesa** (8 colunas): cada votante é uma carta. Contorno tracejado = ainda não votou;
  verso da sala = já votou; face com número = revelado. Offline fica translúcido.
- **Mão** (embaixo): as cartas do baralho. A escolhida sobe e ganha o caqui.
- **Histórico** (4 colunas à direita, sem painel): uma lista quieta; cada rodada revelada
  tem uma mini carta com a estimativa final. No celular, vai para baixo da mão.
- **Conexão**: canto superior direito, texto de 13 px em `musgo` com um pequeno círculo
  que pulsa devagar só enquanto reconecta.

---

## 6. Três princípios do Bluff

1. **O segredo tem forma.** Escondido é padrão, revelado é número. Nenhum ícone de cadeado,
   nenhum "?" na carta: o verso da sala já diz "tem algo aqui que você ainda não pode ver".
2. **Só a carta tem corpo.** Cartas têm borda, sombra e proporção física. Todo o resto é
   impresso direto na mesa: sem sombra, sem borda, separado por espaço.
3. **O caqui é seu.** O acento marca o que é seu (sua carta, sua próxima ação) e o que é
   coletivo e definitivo (o consenso). Se tudo fosse caqui, nada seria.

---

## 7. Movimento

Curva padrão: `cubic-bezier(0.22, 1, 0.36, 1)`. Durações de 150 a 300 ms; só a revelação chega a 500 ms.
Molas do Motion com `stiffness` baixa e `damping` alto (sem quicar).

| Momento                  | O que acontece                                                | Ferramenta |
|--------------------------|---------------------------------------------------------------|------------|
| Clique em botão          | `active:scale-[0.98]` e transição de cor                      | Tailwind   |
| Escolher carta           | sobe 6 px, contorno caqui                                     | Motion     |
| Votar                    | sua carta da mesa vira verso; as outras da mão esmaecem       | Motion     |
| **Revelação**            | todas as cartas da mesa giram no eixo Y (~400 ms), 60 ms entre elas | Motion |
| Consenso                 | anel caqui pulsa uma vez em volta da mesa                     | Motion     |
| Alguém entra ou sai      | cartas se reposicionam (`layout`); a nova aparece com fade    | Motion     |
| Esperando votos          | carta vazia com o contorno pulsando muito devagar (3 s)       | CSS        |
| Abrir a sala             | uma entrada orquestrada: cabeçalho, mesa, mão, em sequência   | Motion     |
| Home, ao rolar           | as três cartas de "como funciona" entram com fade (`whileInView`) | Motion |

Com `prefers-reduced-motion`, tudo que se desloca ou gira vira um fade simples.

---

## 8. Revisão do plano

Reli o plano procurando o que eu faria para qualquer app parecido. Quatro coisas eram genéricas:

| Primeira versão (genérica)                                  | O que mudou                                                                 |
|-------------------------------------------------------------|-----------------------------------------------------------------------------|
| Participantes como avatares redondos com iniciais           | Participantes são **cartas na mesa**. O estado do voto é o estado da carta. |
| Bolinha verde de "online" ao lado de cada nome              | Offline fica translúcido. Nenhuma cor nova só para presença.                |
| Toast a cada evento ("Bia votou!")                          | O evento aparece **na mesa** (a carta vira). Toast nenhum; erros ficam junto do campo ou da ação que falhou. |
| Home com "como funciona" em três caixas com ícone + texto   | As três etapas são **as próprias cartas** (verso, verso, número). A explicação é o objeto. |

Também cortei do plano inicial: um gradiente radial atrás do leque da home (enfeite)
e uma cor diferente para cada estado da rodada (competiria com o caqui; o estado da rodada já
está visível nas cartas).
