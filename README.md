<h1 align="center">CODING LABS</h1>

This is a platgorm for users to code online just like replit. This platform supports multiple languages like NodeJS

## Techstack

- Monorepo
- NextJS (LABS UI)
- NodeJS WebSocket (Tunnel Server): The work of this tunnel server is to provide terminal to the end user and make communications between frontend and the main server.
- NodeJS WebSocket (RUNNER)
- Shadcn
- AWS S3 (for Storing Data)
- Docker and Kubernetes for Runner on demand containers

## How to setup locally?

## NOTE: A Big call out this project won't work on your local system unless you don't have a cloud kubernetes cluster.

- Step1: Fork and clone the repo.
- Step2: install all dependencies

```bash
  pnpm install
```

- Step3: move inside labs apps and copy .env.example to .env and place your aws credencials

```bash
  cd apps/labs && cp .env.example .env
```

- Step 4: Run your app, this start both frontend and backend

```bash
  pnpm dev
```
