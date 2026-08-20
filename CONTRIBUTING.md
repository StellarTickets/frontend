# Contributing to StellarTickets/frontend

## Development setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Before opening a PR

```bash
npx eslint .
npx tsc --noEmit
npm run build
```

## Commit style

Keep commits scoped to one logical change with an imperative subject
line.
