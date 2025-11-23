# ------------------------------
# Stage 1: Build Vue frontend
# ------------------------------
FROM node:20-bullseye AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code (including committed icons.css)
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
