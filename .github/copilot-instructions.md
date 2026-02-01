# Copilot Instructions for Jumper & Carrot

## Overview

- **Jumper**: Tauri + Vue.js desktop app for launching and managing
  scripts/apps. UI in `src/`, backend integration via Tauri (Rust,
  `src-tauri/`).
- **Carrot**: Django-based server (Python) providing backend APIs,
  user/workspace management, and action execution. Code in `src/` and `lib/`.
- Jumper and Carrot are tightly coupled: Jumper is the client, Carrot is the
  server.

## Key Architecture & Patterns

- **Frontend (Jumper)**
  - Vue 3 + Pinia for state management (`src/stores/`).
  - Components in `src/components/`, composables in `src/composables/`.
  - Routing via `src/router/`.
  - Tauri commands bridge frontend and Rust backend (`src-tauri/src/`).
  - TypeScript types in `src/@types/`.
- **Backend (Carrot)**
  - Django app structure: each domain (actions, users, system, workspaces) is a
    Django app in `src/`.
  - API endpoints defined in each app's `views.py` and `urls.py`.
  - Uses Docker for local development; see `docker-compose.yml`.

## Developer Workflows

- **Jumper**
  - Install: `npm install`
  - Dev: `npm run tauri dev` (Vue + Tauri)
  - Build: `npm run build` (production)
  - Rust backend: see `src-tauri/`
- **Carrot (Dockerized)**
  - Install: `mv .env.sample .env`
  - Start: `docker compose up -d --build`
  - Migrate DB: `docker compose exec carrot python manage.py migrate`
  - Create migrations:
    `docker compose exec carrot python manage.py makemigrations`
  - Django code in `src/`, entrypoint: `src/manage.py`
  - Pour toute commande Django, exécuter dans le conteneur `carrot` (voir
    `docker-compose.yml`).

## Conventions & Integration

- **API contracts**: Jumper consomme les endpoints RESTful exposés par Carrot
  (voir `src/services/` côté Jumper, `views.py` côté Carrot).
- **Backend services**: Toute logique métier ou opération spécifique côté
  backend est rangée dans un dossier `services/` de l'app Django concernée.
- **Auth**: Auth classique, OIDC et SCIM supportés côté backend (`auths/`),
  logique côté frontend dans `stores/authUser/`.
- **Actions**: Scripts/actions personnalisés gérés via l'app `actions/` de
  Carrot, exposés dans l'UI Jumper.
- **Type safety**: Types/interfaces partagés dans `src/@types/` côté Jumper.
- **Testing**: Pas de runner de test explicite, suivre les best practices
  Django/Vue si besoin.

## Examples

- Add a new API: Créer une vue Django dans Carrot, exposer via `urls.py`, puis
  consommer côté Jumper via un service dans `src/services/`.
- Ajouter une logique métier backend : placer la logique dans un dossier
  `services/` de l'app Django concernée.
- Add a new UI page: Créer un composant Vue dans `src/components/`, ajouter une
  route dans `src/router/`, gérer l'état dans `src/stores/` si besoin.

## References

- [Jumper README](../README.md)
- [Carrot README](../../Carrot/README.md)
- [docker-compose.yml Carrot](../../Carrot/docker-compose.yml)

---

For questions about architecture or workflow, check the referenced READMEs or
the deployment repo. If unsure about a pattern, prefer existing conventions in
the relevant directory.
