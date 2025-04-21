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
                }
            }
        }

        stage('Continuous Delivery / Livraison Continue') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                dir('front') {
                    sh 'ls'
                    sh "docker build . -t ${DOCKERHUB_USERNAME}/next_cicdcd"
                    // Créer un PAT sur Docker Hub : https://app.docker.com/settings/personal-access-tokens
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
                    sh '''
                        echo "APP_ENV=dev
                        APP_SECRET=
                        DATABASE_URL=mysql://root:root@database:3306/mybank-api-database?serverVersion=9.1.0&charset=utf8mb4
                        CORS_ALLOW_ORIGIN=^https?://(localhost|127\\.0\\.0\\.1)(:[0-9]+)?$" > .env
                    '''
                    sh 'composer install'
                }
            }
        }
    }
}
