FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-slim AS runner

WORKDIR /app

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
ENV HOST=0.0.0.0
ENV DATABASE_URL="file:/data/dev.db"

# Generate Prisma Client
RUN npx prisma generate

# Expose the port
EXPOSE 8080

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"] 