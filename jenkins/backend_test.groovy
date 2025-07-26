node("${AGENT_DOCKER}") {
    stage('Setup Docker Network & MySQL') {
        sh 'docker stop mybank-test-db || true'
        sh 'docker rm mybank-test-db || true'
        sh 'docker network create mybank-network || true'

        sh '''
            docker run -d --rm \
                --name mybank-test-db \
                --network mybank-network \
                -e MYSQL_ROOT_PASSWORD=root \
                -e MYSQL_DATABASE=mybank_test \
                -e MYSQL_USER=symfony \
                -e MYSQL_PASSWORD=symfony \
                mysql:9.0
        '''
    }

    stage('Clone Backend') {
        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
    }

    stage('Install Backend') {
        dir('api') {
            sh '''
                apt-get update && apt-get install -y php php-mysql php-curl php-xml php-mbstring unzip git

                curl -sS https://getcomposer.org/installer | php
                mv composer.phar /usr/local/bin/composer
            '''
            sh 'composer install --no-interaction --optimize-autoloader'
        }
    }

    stage('Prepare .env and JWT keys') {
        dir('api') {
            sh '''
                echo "APP_ENV=test
                APP_SECRET=dummypass
                DATABASE_URL=mysql://symfony:symfony@mybank-test-db:3306/mybank_test
                " > .env.test

                if [ ! -f config/jwt/private.pem ]; then
                    php bin/console lexik:jwt:generate-keypair
                fi
            '''
        }
    }

    stage('Run Symfony Tests') {
        dir('api') {
            sh 'php bin/console doctrine:schema:update --force --env=test'
            sh 'APP_ENV=test php bin/phpunit'
        }
    }

    stage('Cleanup') {
        sh 'docker stop mybank-test-db || true'
        sh 'docker network rm mybank-network || true'
    }
}
