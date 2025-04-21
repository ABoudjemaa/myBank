pipeline {
    agent none

    stages {
        stage('Clone Repository') {
            agent { node { label 'mybank-front-agent' } }
            steps {
                git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
            }
        }

        stage('Install & Run Frontend') {
            agent { node { label 'mybank-front-agent' } }
            steps {
                dir('front') {
                    sh 'npm install'
                    sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
                }
            }
        }

        stage('Continuous Delivery / Livraison Continue') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                dir('front') {
                    sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
                    sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_front"
                    sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
                    sh "docker push ${DOCKERHUB_USERNAME}/mybank_front"
                }
            }
        }

        stage('Clone Backend Repository') {
            agent { node { label 'mybank-backend-agent' } }
            steps {
                git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
            }
        }

        stage('Install & Run Backend') {
            agent { node { label 'mybank-backend-agent' } }
            steps {
                dir('api') {
                    sh """
                        echo \"APP_ENV=${APP_ENV}
                        APP_SECRET=${APP_SECRET}
                        DATABASE_URL=${DATABASE_URL}
                        CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}\" > .env
                    """
                    sh 'composer install'
                }
            }
        }

        stage('Continuous Delivery / Livraison Continue') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                dir('api') {
                    sh """
                        echo \"APP_ENV=${APP_ENV}
                        APP_SECRET=${APP_SECRET}
                        DATABASE_URL=${DATABASE_URL}
                        CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}\" > .env
                    """
                    sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_api"
                    sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
                    sh "docker push ${DOCKERHUB_USERNAME}/mybank_api"
                }
            }
        }
    }
}
