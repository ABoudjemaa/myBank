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

//     stage('Install Backend') {
//         dir('api') {
//             sh '''
//                 apt-get update && apt-get install -y php php-mysql php-curl php-xml php-mbstring unzip git
//
//                 curl -sS https://getcomposer.org/installer | php
//                 mv composer.phar /usr/local/bin/composer
//             '''
//             sh 'composer install --no-interaction --optimize-autoloader'
//         }
//     }

    stage('Prepare .env and JWT keys') {
        dir('api') {
            sh 'rm -f .env.local .env.test.local'

                        // Créer le fichier .env
            sh """
                    echo \"APP_ENV=test
                APP_DEBUG=0
                APP_SECRET=${APP_SECRET}
                DATABASE_URL=mysql://symfony:symfony@mybank-test-db:3306/mybank_test
                CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
                JWT_SECRET_KEY=${JWT_SECRET_KEY}
                JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
                JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env
            """
            // Générer les clés JWT si elles n'existent pas
            sh '''
                if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
                    php bin/console lexik:jwt:generate-keypair
                fi
            '''
            sh 'composer install --no-interaction --optimize-autoloader'

            // Lancer les commandes Symfony dans un env correct
            withEnv(["DATABASE_URL=mysql://symfony:symfony@mybank-test-db:3306/mybank_test"]) {
                sh 'php bin/console doctrine:schema:update --force --env=test'
                sh 'php bin/phpunit'
            }
        }
    }

    stage('Cleanup') {
        sh 'docker stop mybank-test-db || true'
        sh 'docker network rm mybank-network || true'
    }
}
