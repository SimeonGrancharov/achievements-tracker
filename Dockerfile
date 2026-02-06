FROM node:20-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace config + package.jsons first (for Docker layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/

RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/shared/src/ packages/shared/src/
COPY packages/shared/tsconfig.json packages/shared/
COPY apps/server/src/ apps/server/src/
COPY apps/server/tsconfig.json apps/server/

ENV PORT=8080
EXPOSE 8080

CMD ["npx", "tsx", "apps/server/src/index.ts"]
