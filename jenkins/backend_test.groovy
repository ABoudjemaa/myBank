node("${AGENT_DOCKER}") {
    def dockerNetwork = "mybank-network"
    def mysqlContainer = "mybank-test-db"
    def phpImage = "php:8.2-cli" // Change if using another PHP version

    stage('Setup Docker Network & MySQL') {
        sh "docker stop ${mysqlContainer} || true"
        sh "docker rm ${mysqlContainer} || true"
        sh "docker network create ${dockerNetwork} || true"

        sh """
            docker run -d --rm \
                --name ${mysqlContainer} \
                --network ${dockerNetwork} \
                -e MYSQL_ROOT_PASSWORD=root \
                -e MYSQL_DATABASE=mybank_test \
                -e MYSQL_USER=symfony \
                -e MYSQL_PASSWORD=symfony \
                mysql:8.0
        """
    }

    stage('Clone Backend') {
        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
    }

    stage('Run Symfony in Docker') {
        dir('api') {
            // Mount your Symfony project and run setup/tests inside a PHP container
            sh """
                docker run --rm \
                    --network ${dockerNetwork} \
                    -v "\$(pwd)":/app \
                    -w /app \
                    ${phpImage} bash -c '
                        apt-get update && apt-get install -y git unzip zlib1g-dev libzip-dev libicu-dev libonig-dev libxml2-dev libcurl4-openssl-dev libpq-dev && \
                        docker-php-ext-install pdo pdo_mysql intl zip && \

                        curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer && \
                        rm -f .env .env.local .env.test.local && \

                        echo "APP_ENV=test
                        APP_DEBUG=0
                        APP_SECRET=${APP_SECRET}
                        DATABASE_URL=mysql://symfony:symfony@${mysqlContainer}:3306/mybank_test
                        CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                        JWT_SECRET_KEY=${JWT_SECRET_KEY}
                        JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                        JWT_PASSPHRASE=${JWT_PASSPHRASE}" > .env && \

                        composer install --no-interaction --optimize-autoloader && \

                        mkdir -p config/jwt && \
                        if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
                            php bin/console lexik:jwt:generate-keypair
                        fi && \

                        php bin/console doctrine:schema:update --force --env=test && \
                        php bin/phpunit
                    '
            """
        }
    }

    stage('Cleanup') {
        sh "docker stop ${mysqlContainer} || true"
        sh "docker network rm ${dockerNetwork} || true"
    }
}
