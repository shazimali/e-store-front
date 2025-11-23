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

# Install ts-node and typescript first
RUN npm install -g ts-node typescript

# Install project dependencies without running postinstall
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy source code
COPY . .

# Accept API URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

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
