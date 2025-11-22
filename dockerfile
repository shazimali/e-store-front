# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install global pnpm and Alpine build tools for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    git \
    libc6-compat \
    && npm install -g pnpm

# Copy package files first (for caching)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build production
RUN pnpm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:alpine

# Set working directory to match VPS folder
WORKDIR /var/www/everyday_store/frontend

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
