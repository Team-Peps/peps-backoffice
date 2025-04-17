# Étape 1 : Build Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=development

# Étape 2 : Nginx pour servir l'app
FROM nginx:alpine

# Correction du chemin basée sur votre angular.json pour Angular 19
COPY --from=build /app/dist/peps-backoffice/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
