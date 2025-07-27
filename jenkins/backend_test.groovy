node("${AGENT_DOCKER}") {
    stage('Prepare Environment and Docker Compose') {
        deleteDir()

        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
        dir('api') {
            // Create .env file before starting services
            sh """
                    echo \"APP_ENV=dev
                APP_DEBUG=0
                APP_SECRET=${APP_SECRET}
                DATABASE_URL=mysql://root:root@database:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4
                CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                JWT_SECRET_KEY=${JWT_SECRET_KEY}
                JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                JWT_PASSPHRASE=${JWT_PASSPHRASE}
                ADMIN_EMAIL=boudjemaa.amine.2003@gmail.com
                ADMIN_PASSWORD=12345678\" > .env
            """

            sh """
                echo \"APP_ENV=test
                KERNEL_CLASS=App\\\\Kernel
                APP_SECRET=${APP_SECRET}
                DATABASE_URL=mysql://root:root@database_test:3306/mybank-api-database_test?serverVersion=9.1.0&charset=utf8mb4
                CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                JWT_SECRET_KEY=${JWT_SECRET_KEY}
                JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                JWT_PASSPHRASE=${JWT_PASSPHRASE}
                ADMIN_EMAIL=boudjemaa.amine.2003@gmail.com
                ADMIN_PASSWORD=12345678\" > .env.test
            """

            sh 'composer install --no-interaction --optimize-autoloader'

            sh '''
                if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
                  php bin/console lexik:jwt:generate-keypair
                fi
            '''



            // Start all services
            sh 'docker compose up -d'
            // Wait for MySQL to be ready (use retry logic)
            sh '''
                echo "Waiting for MySQL to be ready..."
                for i in {1..30}; do
                  docker compose exec -T database_test mysqladmin ping -h "localhost" -u root -proot && break
                  sleep 2
                done
            '''

           sh """
           docker exec api-backend-1 bash -c 'echo \"APP_ENV=test
                                                              KERNEL_CLASS=App\\\\Kernel
                                                              APP_SECRET=${APP_SECRET}
                                                              DATABASE_URL=mysql://root:root@database_test:3306/mybank?serverVersion=9.1.0&charset=utf8mb4
                                                              CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                                                              JWT_SECRET_KEY=${JWT_SECRET_KEY}
                                                              JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                                                              JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env.test'
           """

            sh 'docker exec -i api-backend-1 bash -c "cd /var/www/project && php bin/console d:m:m --env=test"'
            sh 'docker exec -i api-backend-1 bash -c "cd /var/www/project && php bin/console app:create-user --env=test"'
            sh 'docker exec -i api-backend-1 bash -c "cd /var/www/project && php bin/phpunit"'
        }
    }

}
