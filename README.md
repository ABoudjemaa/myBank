# myBank

# Projet React & Symfony avec Docker

Ce projet contient une application web composée de deux parties :

1. **Frontend (React)** : L'interface utilisateur construite avec React.
2. **Backend (Symfony)** : L'API RESTful développée avec Symfony.

## Structure du projet

Le projet est structuré de la manière suivante :  
/myBank  
 &emsp;├── /frontend &ensp; # Code source du frontend React  
 &emsp;├── /api &emsp; &emsp; &ensp; # Code source de l'API Symfony

## Prérequis

Avant de démarrer, assurez-vous d'avoir installé Docker et Docker Compose sur votre machine.

- Docker : [Installation Docker](https://docs.docker.com/get-docker/)
- Docker Compose : [Installation Docker Compose](https://docs.docker.com/compose/install/)

## Installation

### 1. Cloner le dépôt

Clonez ce projet sur votre machine locale :

```bash
git clone https://github.com/ABoudjemaa/myBank.git
```

### 2. Accéder à l'application

#### 2.1 Backend (Symfony)

1. Navigate to the project directory:
   ```bash
   cd api
   ```
2. Set up the environment variables (.env):
   ```bash
   APP_ENV=dev
   APP_SECRET=
   DATABASE_URL="mysql://root:root@database:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4"
   CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
   ```
3. Build the image :
   ```bash
   docker-compose up
   ```
4. Make migration :
   ```bash
   docker exec -it api-backend-1 bash
   cd project
   php bin/console d:m:m
   ```

- Your app should be running on localhost:8082

#### 2.2 Frontend (React)

1. Navigate to the project directory:
   ```bash
   cd front
   ```
   ```
2. Set up the environment variables (.env):
   ```bash
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8082/api"
   ```
3. Build the image :
   ```bash
   docker build -t mybank-front .
   ```
4. Run a container :
   ```bash
   docker run -p 3001:3000 --name mybank-front-container  mybank-front:latest
   ```

- Your app should be running on localhost:3001
