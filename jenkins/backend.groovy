stage('Clone Backend Repository') {
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

stage('Install Backend') {
    dir('api') {
        sh """
            echo \"APP_ENV=${APP_ENV}
            APP_DEBUG=0
            APP_SECRET=${APP_SECRET}
            DATABASE_URL=${DATABASE_URL}
            CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
            JWT_SECRET_KEY=${JWT_SECRET_KEY}
            JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
            JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env
        """
        sh '''
            if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
              php bin/console lexik:jwt:generate-keypair
            fi
        '''
    }
    stash name: 'symfony-prepared', includes: 'api/.env, api/config/jwt/**'
}

stage('Build & Push API Docker Image') {
    unstash 'symfony-prepared'
    dir('api') {
        sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_api"
        sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
        sh "docker push ${DOCKERHUB_USERNAME}/mybank_api"
    }
}

stage('Deploy MySQL Database') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                docker stop api-database || true &&
                docker rm api-database || true &&
                docker network create app-network || true
                docker run -d \
                  --name api-database \
                  --network app-network \
                  -e MYSQL_ROOT_PASSWORD=root \
                  -e MYSQL_DATABASE=mybank-api-database \
                  -p 3306:3306 \
                  mysql:9.0
            '
        """
    }
}

stage('Run Symfony API') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
              docker stop mybank_api || true &&
              docker rm mybank_api || true &&
              docker network create app-network || true &&
              docker run -d \\
                --name mybank_api \\
                --network app-network \\
                -p 8083:80 \\
                ${DOCKERHUB_USERNAME}/mybank_api:latest
            '
        """
    }
}

stage('Run DB Migrations') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
              sleep 10 && docker exec mybank_api php /var/www/project/bin/console doctrine:migrations:migrate --no-interaction
            '
        """
    }
}
