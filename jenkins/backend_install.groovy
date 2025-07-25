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
//         sh 'composer install --no-interaction --optimize-autoloader'
//         sh 'php bin/phpunit'
    }
    stash name: 'symfony-prepared', includes: 'api/.env, api/config/jwt/**'
}

