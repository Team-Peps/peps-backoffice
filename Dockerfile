# Étape 1 : Build Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# Étape 2 : Nginx pour servir l'app
FROM nginx:alpine

COPY --from=build /app/dist/peps-backoffice /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
