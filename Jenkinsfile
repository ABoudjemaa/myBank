pipeline {
    agent any

    environment {
        REMOTE_USER    = 'root'
        REMOTE_HOST    = '46.101.90.218'
        REPO           = 'git@github.com:ABoudjemaa/api_platform.git'
        DEST_FOLDER    = 'api_platform'
    }

    stages {
        // stage('Clone Repository') {
        //     agent { label 'front-agent' }
        //     steps {
        //         git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
        //     }
        // }

        // stage('Install & Run Frontend') {
        //     agent { label 'front-agent' }
        //     steps {
        //         dir('front') {
        //             sh 'npm install'
        //             sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
        //         }
        //     }
        // }

        // stage('Continuous Delivery / Livraison Continue') {
        //     agent { label "${AGENT_DOCKER}" }
        //     steps {
        //         dir('front') {
        //             sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
        //             sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_front"
        //             sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
        //             sh "docker push ${DOCKERHUB_USERNAME}/mybank_front"
        //         }
        //     }
        // }

        stage('Generate lexik jwt keypair') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
    ssh-keyscan -H \$REMOTE_HOST >> ~/.ssh/known_hosts
    ssh -i \$SSH_KEY \$REMOTE_USER@\$REMOTE_HOST "ls"
"""
                    sh """
                    ssh -i \$SSH_KEY \$REMOTE_USER@\$REMOTE_HOST \\
                    "docker pull ${DOCKERHUB_USERNAME}/mybank_front"
                    """
                }
            }
        }

        stage('Run Next.js App') {
    steps {
        withCredentials([
            sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
        ]) {
            sh """
                ssh -i \$SSH_KEY \$REMOTE_USER@\$REMOTE_HOST '
                docker stop mybank_front || true &&
                docker rm mybank_front || true &&
                docker run -d --name mybank_front -p 3000:3000 ${DOCKERHUB_USERNAME}/mybank_front
                '
            """
        }
    }
}


        // stage('Clone Backend Repository') {
        //     agent { node { label 'mybank-backend-agent' } }
        //     steps {
        //         git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
        //     }
        // }

        // stage('Install & Run Backend') {
        //     agent { node { label 'mybank-backend-agent' } }
        //     steps {
        //         dir('api') {
        //             sh """
        //                 echo \"APP_ENV=${APP_ENV}
        //                 APP_SECRET=${APP_SECRET}
        //                 DATABASE_URL=${DATABASE_URL}
        //                 CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}\" > .env
        //             """
        //             sh 'composer install'
        //         }
        //     }
        // }

        // stage('Continuous Delivery / Livraison Continue api symfony') {
        //     agent { label "${AGENT_DOCKER}" }
        //     steps {
        //         dir('api') {
        //             sh """
        //                 echo \"APP_ENV=${APP_ENV}
        //                 APP_SECRET=${APP_SECRET}
        //                 DATABASE_URL=${DATABASE_URL}
        //                 CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}\" > .env
        //             """
        //             sh "docker build . -t ${DOCKERHUB_USERNAME}/myBank_api"
        //             sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}" // Créer un PAT sur Docker Hub : https://app.docker.com/settings/personal-access-tokens
        //             sh "docker push ${DOCKERHUB_USERNAME}/myBank_api"
        //         }
        //     }
        // }
    }
}
