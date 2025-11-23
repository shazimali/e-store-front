# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-bullseye AS build

# Set working directory
WORKDIR /app

# Install build tools for native dependencies
RUN apt-get update && apt-get install -y python3 make g++ git curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build production output
RUN npm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:stable

# Set working directory (maps to your VPS path)
WORKDIR /var/www/everyday_store/frontend

# Remove default Nginx static folder
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend build
COPY --from=build /app/dist /usr/share/nginx/html

# Expose container port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
