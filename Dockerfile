FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Verify dist directory exists
RUN ls -la dist || exit 1

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files and config from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Create directory for database
RUN mkdir -p /app/data

# Create volume for persistent database
VOLUME ["/app/data"]

# Set environment variables
ENV NODE_ENV=production

# Start the application with tsconfig-paths
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"] 
