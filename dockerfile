# Stage 1: Build Vue frontend
FROM node:20-bullseye AS build

WORKDIR /app

# Install global pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build production
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:stable

WORKDIR /var/www/everyday_store/frontend

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
