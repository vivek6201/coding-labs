FROM node:18.20.4-alpine AS base
RUN apk update && apk add libc6-compat
# Install pnpm and turbo globally
RUN npm install -g pnpm
RUN npm install -g turbo
 
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune labs --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN corepack enable
RUN pnpm install --frozen-lockfile
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=labs
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/labs/.next/standalone ./next/standalone
COPY --from=installer --chown=nextjs:nodejs /app/apps/labs/.next/static ./next/standalone/apps/labs/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/labs/public ./next/standalone/apps/labs/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/labs/config.yaml ./next/standalone/apps/labs/config.yaml

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV KUBECONFIG /app/next/standalone/apps/labs/config.yaml

CMD node next/standalone/apps/labs/server.js
