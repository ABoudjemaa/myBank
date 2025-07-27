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
 &emsp;├── /jenkins &ensp; # Configuration Jenkins pour l'intégration continue
 &emsp;├── /Jenkinsfile &ensp; # Fichier de configuration Jenkins pour le pipeline CI/CD
 &emsp;├── /README.md &ensp; # Documentation du projet

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
   JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
   JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
   JWT_PASSPHRASE=
   ```
3. Set up the test environment variables (.env.test):
   ```bash
   APP_ENV=test
   KERNEL_CLASS=App\\\\Kernel
    APP_SECRET=
   DATABASE_URL=mysql://root:root@database_test:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4
    CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
    JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
   JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
   JWT_PASSPHRASE=
   ```
4. install dependencies :
   ```bash
   composer install
    ```
5. generate JWT keys :
   ```bash
   php bin/console lexik:jwt:generate-keypair
   ```
6. Build the image :
   ```bash
   docker-compose up
   ```
7. Make migration :
   ```bash
   docker exec -it api-backend-1 bash
   cd project
   php bin/console d:m:m
   php bin/phpunit
   ```

- Your app should be running on localhost:8082

#### 2.2 Frontend (React)

1. Navigate to the project directory:
   ```bash
   cd front
   ```
2. Set up the environment variables (.env):
   ```bash
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8082/api"
   NEXT_PUBLIC_API_BASE_TEST_URL=http://backend/api
   ```
3. Build the image :
   ```bash
   docker build -t mybank-front .
   ```
4. Run a container :
   ```bash
   docker run -p 3001:3000 --name mybank-front-container  mybank-front:latest
   ```
5. Run tests :
   ```bash
   docker network connect api_default mybank-front-container
   docker exec -it mybank-front-container bash
   npx vitest run
   ```
- Your app should be running on localhost:3001

## CI/CD avec Jenkins
### Configuration de Jenkins
1. Installez Jenkins sur votre machine ou utilisez une instance Jenkins existante.
   ```bash 
    docker run -d \
     --name jenkins \
     -p 8080:8080 -p 50000:50000 \
     -v jenkins_home:/var/jenkins_home \
     jenkins/jenkins:lts
   ```
2. Créez un nouveau pipeline dans Jenkins.
3. Configurez le pipeline pour utiliser le fichier `Jenkinsfile` fourni dans le projet.
   ```bash
   APP_ENV=${APP_ENV}
   APP_SECRET=${APP_SECRET}
   DATABASE_URL=${DATABASE_URL}
   CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
   JWT_SECRET_KEY=${JWT_SECRET_KEY}
   JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
   JWT_PASSPHRASE=${JWT_PASSPHRASE}
   REMOTE_USER =${REMOTE_USER}
   REMOTE_HOST=${REMOTE_HOST}
   DOCKER_PASSWORD=${DOCKER_PASSWORD}
   AGENT_DOCKER=${AGENT_DOCKER}
   DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}
   ```
4. Assurez-vous que Jenkins a accès à Docker pour pouvoir construire et exécuter les conteneurs.
   - Créer un Agent docker.
   - Créer un Agent Frontend.
   - Créer un Agent Backend.
5. Configurez les credentials nécessaires pour accéder au dépôt Git et aux environnements de production si nécessaire.
   - ```bash
     stage('Run Symfony API') {
        withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
     ])
     ```
6. Configurez les déclencheurs pour automatiser le pipeline, par exemple, à chaque push sur la branche principale.
   - utiliser le webhook de GitHub pour déclencher le pipeline à chaque push.
   - utiliser ngrok pour exposer le port 8080 de Jenkins.