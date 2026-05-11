# Roadmap do BibleApp

## Entregue no MVP inicial
- `feat/mvp-reader-share`
  - Base Next.js + TypeScript + Knex + Postgres + Auth.js
  - Tela `Hoje` com mensagem montada automaticamente por plano e data
  - Perfis `admin` e `user`
  - Leitor por livro/capítulo
  - Planos iniciais
  - Grupos e registro de compartilhamento
  - Progresso e notas simples

## Próximas branches sugeridas

## Ordem recomendada da Fase 2
1. `feat/chapter-context`
2. `feat/multi-translation`
3. `feat/custom-plan-builder`
4. `feat/highlights-and-favorites`
5. `feat/reminders`
6. `feat/auth-sync`
7. `feat/pwa-install`

### `feat/auth-sync`
- Expandir onboarding e tratamento de sessão
- Recuperação de senha e UX de autenticação
- Promoção manual de `user` para `admin`

### `feat/pwa-install`
- Banner de instalação mais refinado
- Cache offline do shell do app
- Melhorias de abertura pelo ícone instalado

### `feat/custom-plan-builder`
- Criar planos em 365, 180 e 90 dias
- Escolher modelo tradicional ou cronológico
- Salvar combinações personalizadas

### `feat/multi-translation`
- Adaptar importadores para traduções licenciadas
- Troca de versão em tempo real no mesmo capítulo
- Melhorar fallback de conteúdo ausente

### `feat/chapter-context`
- Resumo histórico por capítulo
- Autoria, contexto, motivação e curiosidades
- Conteúdo editorial sem excesso de teologia

### `feat/highlights-and-favorites`
- Destaque de versículos
- Favoritos
- Biblioteca de notas e trechos salvos

### `feat/reminders`
- Lembretes diários
- Retomada de plano atrasado
- Notificações orientadas ao hábito
