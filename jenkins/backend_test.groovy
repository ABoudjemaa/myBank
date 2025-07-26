node("${AGENT_DOCKER}") {

    stage('Clone Backend') {
        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
    }

    stage('Prepare Environment and Docker Compose') {
        dir('api') {
            sh 'rm -f .env .env.local .env.test.local'
            // Create .env file before starting services
            sh """
                echo "APP_ENV=test
                APP_SECRET=${APP_SECRET}
                DATABASE_URL=mysql://root:root@database:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4
                CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                JWT_SECRET_KEY=${JWT_SECRET_KEY}
                JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                JWT_PASSPHRASE=${JWT_PASSPHRASE}" > .env
            """

            // Start all services
            sh 'docker compose up -d'

            // Wait for MySQL to be ready (use retry logic)
            sh '''
                echo "Waiting for MySQL to be ready..."
                for i in {1..30}; do
                  docker compose exec -T database mysqladmin ping -h "localhost" -u root -proot && break
                  sleep 2
                done
            '''
        }
    }

    stage('Install Dependencies and Run Symfony Commands') {
        dir('api') {
            // Run these inside your app container (defined in docker-compose.yml as `php` or similar)
            sh '''
                docker compose exec -T php composer install --no-interaction --optimize-autoloader

                if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
                    docker compose exec -T php php bin/console lexik:jwt:generate-keypair
                fi

                docker compose exec -T php php bin/console doctrine:schema:update --force --env=test
                docker compose exec -T php php bin/phpunit
            '''
        }
    }

    stage('Cleanup') {
        dir('api') {
            sh 'docker compose down -v'
        }
    }
}
