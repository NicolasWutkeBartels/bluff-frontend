# Convenções do código (front)

Resumo das regras de organização e de nomes. Seguem as convenções do Next.js, do shadcn/ui
e da comunidade React/TypeScript.

## Camadas

```
src/
  app/            rotas (App Router). A page só orquestra: lê parâmetros, escolhe o que mostrar.
  components/
    ui/           componentes do shadcn, reestilizados pelos tokens do Bluff
    carta/        a carta (corpo, face, verso, lugar vazio, flip) e o verso Truchet
    marca/        logo e marca
    form/         Form, FormField e os campos (TextField, SelectField...) sobre react-hook-form
    home/         seções e formulários da home
    sala/         tudo da tela da sala
  hooks/          React Query (queries e mutations) e hooks de comportamento
  services/       requisições HTTP. Um arquivo por recurso da API.
  schemas/        Zod: formulários, respostas da API e eventos. Os tipos saem daqui (z.infer).
  constants/      valores fixos (status de rodada, animações, marca)
  lib/            funções puras e utilitários (localStorage, Truchet, estado da sala em cache)
  types/          tipos genéricos reutilizáveis (common, form, carta, sala)
```

O caminho de um dado: **component → hook → service → API**. Componentes não chamam
`axios` nem `services` diretamente; usam um hook (`useSala`, `useIniciarRodada`...).
Toda resposta da API passa por um esquema Zod dentro do service.

## Nomes

| O quê | Padrão | Exemplo |
|---|---|---|
| Arquivos e pastas | `kebab-case` | `form-criar-sala.tsx`, `use-sala-ao-vivo.ts` |
| Service | `<recurso>.service.ts`, exporta `<recurso>Service` | `rodada.service.ts` → `rodadaService.votar()` |
| Schema | `<recurso>.schema.ts`, exporta `<nome>Schema` | `sala.schema.ts` → `criarSalaFormSchema` |
| Esquema de formulário | `<ação><Recurso>FormSchema` + tipo `<Ação><Recurso>Form` | `novaRodadaFormSchema`, `NovaRodadaForm` |
| Componente | `PascalCase`, um por arquivo | `FaceCarta` em `face-carta.tsx` |
| Página | `<Rota>Page` (export default) | `HomePage`, `SalaPage` |
| Hook | `use<Algo>` em `use-<algo>.ts` | `useMeuVoto` em `use-meu-voto.ts` |
| Tipos | `PascalCase`, sem prefixo `I`/`T` | `EstadoSala`, `Papel` |
| Funções e variáveis | `camelCase`, funções são verbos | `lerErroApi`, `aplicarErrosDaApi` |
| Constantes de módulo | `UPPER_SNAKE_CASE` | `STATUS_RODADA`, `SEM_ESTIMATIVA` |

O domínio fica em português (como na API); termos de framework ficam como são (`Schema`, `service`, `use`).

## Props

| O quê | Padrão | Exemplo |
|---|---|---|
| Texto exibido | `label` (e variações `label<Estado>`), `title`, `description`, `placeholder` | `label`, `labelSaving`, `title` |
| Dado que vem do DTO | o mesmo nome do DTO; em campo de formulário, `name` | `participanteId`, `codigoSala`, `voto`, `name="nomeSala"` |
| Evento | `on<Verbo>` | `onVote`, `onEnter`, `onLeave` |
| Booleano | `is<Algo>` / `has<Algo>` | `isActive`, `isRevealed`, `isRequired` |
| Props de UI | nomes do React/shadcn | `value`, `size`, `index`, `options`, `format`, `seed`, `className` |

## Tipos genéricos (`src/types`)

Antes de escrever um tipo de props do zero, veja se um destes resolve:

| Tipo | Para quê |
|---|---|
| `Nullable<T>` | `T \| null` |
| `Handler<T>` | callback: `Handler` = `() => void`, `Handler<string>` = `(value: string) => void` |
| `WithClassName<P>` | `P` + `className?` |
| `PropsWithout<C, K>` | props do componente `C` sem as chaves `K` |
| `Option<V>` | `{ value, label, disabled? }` de Select, ToggleGroup etc. |
| `ControlProps<C>` / `FieldProps<T, P>` | props de um controle de formulário e de um campo (`types/form.ts`) |
| `CartaProps<P>` | `size` + `className` das peças de carta |
| `ParticipanteNaSala<P>` | `codigoSala` + `participanteId` |

## Estilo

- Sem comentários no código: nomes claros no lugar de explicação. O "porquê" das decisões fica em `docs/`.
- Repasse props com `{...props}` (ou `{...field}`) e sobrescreva só o que muda de verdade
  (ex.: `value={field.value ?? ""}`), em vez de repassar uma por uma.

## Imports

Três blocos, nessa ordem, separados por linha em branco:

1. pacotes externos (`react`, `motion/react`, `lucide-react`...)
2. aliases do projeto (`@/components/...`, `@/hooks/...`)
3. relativos da mesma pasta (`./mesa`)

`cn` vem do pacote `cn` (é o que o shadcn gera).

## Formulários

Todo formulário usa os componentes de `components/form/` (react-hook-form + Zod + `Field` do shadcn):

```tsx
const form = useForm<CriarSalaForm>({ resolver: zodResolver(criarSalaFormSchema), defaultValues });

<Form methods={form} onSubmit={async (dados) => { await criacao.mutateAsync(dados); router.push(...); }}>
  <FieldGroup>
    <TextField name="nomeSala" label="Nome da sala" placeholder="..." maxLength={80} />
    <SelectField name="baralho" label="Baralho" options={options} />
    <PapelField />
    <SubmitButton labelSaving="Criando…">Criar sala</SubmitButton>
    <FormError />
  </FieldGroup>
</Form>
```

- `Form` é o `FormProvider` (recebe o retorno do `useForm` em `methods`) + o `<form>`. Se o `onSubmit`
  falhar, os `campos` do erro da API vão para os campos de mesmo `name`; o resto vira erro `root`,
  mostrado por `<FormError />`. Por isso **o `name` do campo é o mesmo nome do campo na API**.
- Campos prontos: `TextField`, `NumberField` (guarda `number`/`null`), `TextareaField`, `SelectField`,
  `ToggleGroupField` (opções em `Option[]`) e `PapelField`.
- Obrigatórias: `name` e `label`. Opcional: `description` (texto de ajuda; o erro de validação é automático).
- `isRequired`: só visual (asterisco em caqui no rótulo) e `aria-required`. Quem exige o campo é o
  esquema Zod (com `zodResolver`, o react-hook-form ignora as `rules` dos campos). Marque `isRequired`
  em todo campo que o esquema exige.
- **Todas as outras props vão para o controle** (o `Input`, o `SelectTrigger`...), como se ele não estivesse
  componentizado. Cada parte ainda pode ser estilizada: `fieldProps`, `labelProps`, `descriptionProps`,
  `errorProps` (e `selectProps`/`contentProps`/`itemProps` onde fizer sentido).
- Layout ou controle que os campos prontos não cobrem: `FormField` com `render`, que entrega `field`,
  `fieldState`, `ariaProps` (id + aria) e `labelId` para espalhar no controle (ex.: `form-nova-rodada.tsx`).
- Ids são gerados com `useId`; não precisa inventar id para ligar rótulo e campo.
- Para o TypeScript conferir o `name`, passe o tipo: `<TextField<CriarSalaForm> name="nomeSala" ... />`.

## Tailwind

- Use sempre a classe pronta quando ela existir: `font-semibold` (não `font-[600]`), `text-2xl`
  (não `text-[24px]`), `w-16`, `max-w-280`, `rotate-8`, `aspect-5/7`, `bg-nanquim/5`, `font-stretch-90%`.
- Só use valor arbitrário quando não houver classe. Se for tamanho, em `rem` (`text-[0.8125rem]`), nunca em `px`.
  Exceções que continuam em `px`: espessura de borda, sombra e outline.
- Pesos sem classe (`font-[650]`) e unidades relativas (`em`, `ch`, `vh`) podem ficar arbitrários.

## shadcn e a marca

- Sempre que existir um componente do shadcn para o caso, use-o
  (`Button`, `Input`, `Select` + `SelectGroup`, `ToggleGroup`, `Field`...).
- Para adaptar à marca, edite o componente em `components/ui/` (é código nosso) ou use os
  tokens de `globals.css` (`nanquim`, `musgo`, `caqui`, `folha`, `papel`...). Não use cores cruas.
- Regras visuais do Bluff (só um acento, erro com texto em nanquim e ícone em caqui, raios por
  hierarquia): ver [design.md](design.md).
