<h1 align="center">CODING LABS</h1>

This is a platgorm for users to code online just like replit. This platform supports multiple languages like NodeJS

## Techstack

- Monorepo
- NextJS (LABS UI)
- NodeJS WebSocket (RUNNER)
- Shadcn 
- AWS S3 (for Storing Data)
- Docker and Kubernetes for Runner on demand containers
  
## How to setup locally?

- Step1: Fork and clone the repo.
- Step2: install all dependencies
```bash
  pnpm install
```
- Step3: copy .env.example to .env and place your aws credencials
```bash
  cp .env.example .env
```

- Step 4: Run your app, this start both frontend and backend
```bash
  pnpm dev
```



