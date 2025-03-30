FROM node:18-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-slim AS runner

WORKDIR /app

# Install LiteFS
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sSL https://fly.io/install.sh | sh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create data directory for SQLite
RUN mkdir -p /data

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_URL="file:/data/dev.db"

# Expose the port
EXPOSE 8080

# Start LiteFS and the application
CMD ["sh", "-c", "litefs mount /data & npx prisma migrate deploy && npm start"] 