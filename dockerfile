# Stage 1: Build
FROM node:20-bullseye AS build

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install dev dependencies required for icon build
RUN npm install --save-dev ts-node typescript @types/node

# Copy source code (including committed icons.css)
COPY . .

# Compile and run the icon build script
RUN npx tsc src/plugins/iconify/build-icons.ts --esModuleInterop --module commonjs --outDir dist
RUN node dist/src/plugins/iconify/build-icons.js

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
