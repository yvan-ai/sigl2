# Dockerfile pour le frontend
FROM node:18

# Répertoire de travail
WORKDIR /app

# Copier le package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .


# Construire le projet React
RUN npm run build

# Exposer le port 3000 pour le développement
EXPOSE 3000

# Lancer le serveur
CMD ["npm", "start"]
