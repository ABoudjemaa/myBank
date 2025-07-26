stage('Setup Docker Network & Database') {
    agent { label "${AGENT_DOCKER}" }
    steps {
        script {
            // Create a network to share between DB and backend
            sh "docker network create mybank-network || true"

            // Run MySQL (or use postgres if you prefer)
            sh '''
                docker run -d --rm \
                    --name mybank-test-db \
                    --network mybank-network \
                    -e MYSQL_ROOT_PASSWORD=root \
                    -e MYSQL_DATABASE=mybank_test \
                    -e MYSQL_USER=symfony \
                    -e MYSQL_PASSWORD=symfony \
                    -p 3306:3306 \
                    mysql:9
            '''
        }
    }
}



stage('Clone Backend Repository') {
    agent { label 'backend-agent' }
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

stage('Install Backend') {
    agent { label 'backend-agent' }
    dir('api') {
        sh """
            echo \"APP_ENV=${APP_ENV}
            APP_DEBUG=0
            APP_SECRET=${APP_SECRET}
            DATABASE_URL=mysql://symfony:symfony@mybank-test-db:3306/mybank_test
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
        sh 'composer install --no-interaction --optimize-autoloader'
        sh 'php bin/console doctrine:schema:update --force --env=test'
        sh 'php bin/phpunit'
    }
    stash name: 'symfony-prepared', includes: 'api/.env, api/config/jwt/**'
}

