pipeline {
    agent none 

    stages {
        stage('Clone Repository') {
            agent { node { label 'mybank-front-agent' } }
            steps {
                git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
                sh 'ls'
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