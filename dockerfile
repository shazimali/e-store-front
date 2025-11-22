# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-bullseye AS build

# Set working directory
WORKDIR /app

# Install build tools for native dependencies
RUN apt-get update && apt-get install -y python3 make g++ git curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install exact pnpm version
RUN npm install -g pnpm@8.6.2

# Copy package files for caching
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
FROM nginx:stable

# Set working directory to VPS folder
WORKDIR /var/www/everyday_store/frontend

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 inside container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
