node("${AGENT_DOCKER}") {

    stage('Clone Backend') {
        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
    }

    stage('Run Symfony in Docker') {
        dir('api') {
            sh """
                echo \"APP_ENV=test
                APP_SECRET=${APP_SECRET}
                DATABASE_URL=mysql://root:root@database:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4
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
            sh 'docker compose up -d'
        }
    }
}
