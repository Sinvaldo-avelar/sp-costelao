
# SP Costelão — Sistema de Estoque de Supermercado

Este projeto é um sistema de controle de estoque para supermercados, desenvolvido com Next.js e Supabase. Ele permite gerenciar entradas, saídas, inventário, relatórios e auditoria de produtos.

## Funcionalidades
- Cadastro de produtos
- Entrada e saída de mercadorias
- Inventário e balanço
- Relatórios detalhados
- Alertas de estoque crítico
- Controle de acesso por setor/perfil (RBAC)
- Logs de auditoria

## Estrutura do Projeto

- `src/app/` — Páginas e rotas
- `src/components/` — Componentes reutilizáveis
- `src/hooks/` — Hooks customizados
- `src/contexts/` — Contextos globais (ex: autenticação)
- `src/middlewares/` — Middlewares para proteção de rotas
- `src/lib/` — Utilitários, validação, logger
- `src/tests/` — Testes automatizados
- `types/` — Tipos TypeScript

## Segurança
- Autenticação via Supabase
- Proteção de rotas e RBAC
- Validação e sanitização de dados com Zod
- Variáveis sensíveis protegidas em `.env.local`

## Testes
- Testes unitários com Jest (exemplo em `src/tests/exemplo.test.ts`)
- Recomenda-se adicionar mais testes para lógica de negócio e componentes

## Como rodar o projeto

1. Instale as dependências:
	```bash
	npm install
	```
2. Configure o arquivo `.env.local` com as chaves do Supabase
3. Rode o servidor de desenvolvimento:
	```bash
	npm run dev
	```
4. Acesse [http://localhost:3000](http://localhost:3000)

## Contribuição
Sugestões e melhorias são bem-vindas! Veja o código e contribua.

---
Projeto inicial baseado em [Next.js](https://nextjs.org) e [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# sp-costelao
# sp-costelao
