# # Use Node.js v24.14.0 specifically
# FROM node:24.14.0-alpine

# # Enable corepack and ensure latest pnpm is active
# RUN corepack enable && corepack prepare pnpm@latest --activate

# # Add compatibility library
# RUN apk add --no-cache bash libc6-compat git openssh-client

# # Set working directory
# WORKDIR /app

# # Copy npm/pnpm configs and lockfile
# COPY .npmrc* ./
# COPY package.json pnpm-lock.yaml* ./

# # Install dependencies
# RUN pnpm install

# # Copy app source code
# COPY . .

# # Expose dev port
# EXPOSE 3000

# # Default command
# CMD ["pnpm", "dev"]


FROM node:24.14-bookworm-slim

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install utilities
RUN apt-get update && apt-get install -y \
    bash \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# IMPORTANT:
# Copy prisma schema BEFORE pnpm install
COPY prisma ./prisma

# Install dependencies
RUN pnpm install

# Copy rest of application
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]