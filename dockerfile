# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g pnpm

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

# Set container working directory to VPS path
WORKDIR /var/www/everyday_store/frontend

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
