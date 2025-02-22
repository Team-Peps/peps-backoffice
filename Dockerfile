# Étape 1 : Build de l'application Angular
FROM node:18-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installation des dépendances en mode production
RUN npm ci --no-audit --no-fund

# Copie du code source
COPY . .

# Build de l'application Angular
RUN npm run build --prod

# Étape 2 : Image minimale avec Nginx pour servir l'application
FROM nginx:alpine

# Suppression des fichiers par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers Angular compilés depuis l’étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration sécurisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sécurisation : Exécution sous un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exposition du port 80
EXPOSE 80

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]
