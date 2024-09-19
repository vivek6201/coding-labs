# Creating a multistage dockerfile for security & performance

# state 0
FROM node:18.20.4-alpine AS base
RUN apk update && apk add libc6-compat
RUN apk update && apk add make gcc g++ python3

# state 1
FROM base AS development
WORKDIR /app
# Install pnpm and turbo globally
RUN npm install -g pnpm
RUN npm install -g turbo

COPY . .
RUN turbo prune runner --docker

# stage 2
FROM base AS installer
WORKDIR /app

# Install pnpm and turbo globally
RUN npm install -g pnpm
RUN npm install -g turbo

COPY --from=development /app/out/json/ .
RUN pnpm install
COPY --from=development /app/out/full/ .
RUN pnpm turbo build --filter=runner 

# stage 3
FROM base AS runner
WORKDIR /app

COPY --from=installer /app .

EXPOSE 4000

CMD node apps/runner/dist/index.js