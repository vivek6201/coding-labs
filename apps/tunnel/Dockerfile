# Creating a multistage dockerfile for security & performance

# state 0
FROM node:18.20.4-alpine AS base
RUN apk update && apk add libc6-compat
RUN apk update && apk add make gcc g++ python3
RUN apk add --no-cache bash
# Install pnpm and turbo globally
RUN npm install -g pnpm
RUN npm install -g turbo

# state 1
FROM base AS development
WORKDIR /app
COPY . .
RUN turbo prune tunnel --docker

# stage 2
FROM base AS installer
WORKDIR /app

COPY --from=development /app/out/json/ .
RUN pnpm install
COPY --from=development /app/out/full/ .
RUN pnpm turbo build --filter=tunnel

# stage 3
FROM base AS runner
WORKDIR /app

# Copy the application code to /app
COPY --from=installer /app .

# Set the HOME environment variable explicitly
ENV HOME /workspace

# Expose the port where the application runs
EXPOSE 8080

CMD ["node","apps/tunnel/dist/index.js"]