node("${AGENT_DOCKER}") {

//     stage('Clone Backend') {
//         git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
//     }

    stage('Prepare Environment and Docker Compose') {
        git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
        dir('api') {
            sh 'rm -f .env .env.local .env.test.local'
            // Create .env file before starting services
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

            sh 'ls -la .env'

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

}
