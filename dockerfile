# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install global pnpm and build tools for Alpine
RUN apk add --no-cache python3 make g++ \
    && npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build production files
RUN pnpm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:alpine

# Set container working directory to match VPS folder
WORKDIR /var/www/everyday_store/frontend

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 inside container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
