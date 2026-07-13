# ===== Build Stage =====
FROM node:22-slim AS builder
WORKDIR /app

# Install all dependencies (including devDeps for Prisma CLI)
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Build Next.js
COPY tsconfig.json next.config.ts ./
COPY public/ ./public/
COPY src/ ./src/
# Generate standalone Tailwind CSS (avoids webpack CSS parsing issues) then build
RUN npx tailwindcss -i src/app/tailwind-input.css -o public/tailwind.css && npx next build --webpack

# ===== Production Stage =====
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=6001
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_ENGINES_MIRROR=

# Install OpenSSL for Prisma engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy full build output (includes all node_modules with Prisma engine)
COPY --from=builder /app ./

EXPOSE 6001

# Auto-apply schema on first startup, then launch Next.js
CMD ["sh", "-c", "npx prisma db push; exec node_modules/.bin/next start"]
