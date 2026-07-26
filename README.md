# Pause Empathique — Front-end

> Projet conçu et développé en solo dans le cadre du titre RNCP6 Concepteur Développeur d'Applications.

SPA Vue.js 3 consommant l'API REST Pause Empathique. Permet de pratiquer l'auto-empathie de façon guidée, inspirée par la Communication Non Violente (CNV).

## Stack technique

- **Vue 3** + **TypeScript** — framework et typage
- **Vite** — bundler
- **Vue Router 4** — routing côté client
- **Pinia** — gestion d'état (authentification)
- **Axios** — client HTTP
- **Tailwind CSS v4** — styles
- **ESLint + Prettier** — qualité de code
- **GitHub Actions** — CI (lint, type-check, build)

## Lancer le projet en local

**Prérequis :** Node.js 20+

```bash
# 1. Installer les dépendances
npm install

# 2. Copier et remplir les variables d'environnement
cp .env.example .env

# 3. Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

> Le back-end Django doit tourner sur `http://localhost:8000` (voir [repo back-end](https://github.com/CamilleFasani/Pause_Empathique)). En local, les appels `/api/*` passent par le proxy Vite pour que les cookies `HttpOnly` de refresh restent sur le même origin que la SPA.

## Scripts disponibles

| Commande             | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Serveur de développement      |
| `npm run build`      | Build de production           |
| `npm run type-check` | Vérification TypeScript       |
| `npm run lint`       | Linting ESLint                |
| `npm run lint:fix`   | Correction automatique ESLint |
| `npm run format`     | Formatage Prettier            |

## Variables d'environnement

| Variable                | Description                                        | Exemple                 |
| ----------------------- | -------------------------------------------------- | ----------------------- |
| `VITE_API_URL`          | URL appelée par le navigateur                      | `/api/v1`               |
| `VITE_API_PROXY_TARGET` | Cible Django du proxy Vite en développement local  | `http://localhost:8000` |
