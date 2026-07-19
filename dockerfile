# ==========================
# Stage 1: Build
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only dependency files first (CACHEABLE)
COPY package.json package-lock.json ./

# Deterministic & faster install
RUN npm ci --no-audit --no-fund --legacy-peer-deps

# Copy rest of source
COPY . .

# Build-time env
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npx tsc -p tsconfig.scripts.json \
    && node scripts-dist/build-icons.cjs \
    && npm run build

# ==========================
# Stage 2: Runtime
# ==========================
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
