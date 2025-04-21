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
                    sh 'node -v'
                    sh 'npm install'
                    sh 'ls'
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
                    sh 'pwd'
                    sh 'ls -la'  
                    sh 'php -v'
                    // sh 'composer install'
                }
            }
        }
    }
}