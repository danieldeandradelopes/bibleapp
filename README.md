# BibleApp

Webapp bíblico em Next.js focado em leitura diária, progresso, notas por capítulo e mensagem pronta para WhatsApp conforme o plano do dia.

## Stack
- Next.js 16
- React 19
- TypeScript
- Knex
- Postgres
- Auth.js (credentials)
- Tailwind CSS v4

## Rodando localmente
1. Copie `.env.example` para `.env`
2. Ajuste a conexão do banco usando `DATABASE_URL` ou `DB_HOST`/`DB_PORT`/`DB_DATABASE`/`DB_USER`/`DB_PASSWORD`, além de `AUTH_SECRET` e `ADMIN_EMAIL`
3. Instale dependências: `pnpm install`
4. Rode migrations e seed:
   - `pnpm db:migrate`
   - `pnpm db:seed`
5. Suba o app: `pnpm dev`

## Credenciais de seed
- Admin: e-mail definido em `ADMIN_EMAIL` com senha `admin123`
- Usuário demo: `user@bibleapp.local` com senha `user123`

## Scripts
- `pnpm dev`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`

## Importar ARC
Você pode importar a versão `ARC` para o banco com:

```bash
pnpm db:import:arc
```

Por padrão, o script baixa a fonte em:

`https://raw.githubusercontent.com/maatheusgois/bible/main/versions/pt-br/arc.json`

Se quiser usar um arquivo local em vez da URL, rode com `ARC_SOURCE_FILE=/caminho/do/arc.json`.
