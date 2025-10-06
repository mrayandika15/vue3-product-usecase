## Multi-stage build for Vite Vue3 app
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Build
COPY . .
# Ensure Vite production build uses the same local env config
COPY .env.local .env.production.local
RUN npm run build

# Production image using nginx
FROM nginx:alpine

# Copy custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
