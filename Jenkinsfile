pipeline {
    agent any

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

        // stage('Pull Front Image on the server') {
        //     steps {
        //         withCredentials([
        //             sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
        //         ]) {
        //             sh """
        //                 mkdir -p ~/.ssh
        //                 ssh-keyscan -H ${REMOTE_HOST} >> ~/.ssh/known_hosts
        //                 ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
        //                 docker pull ${DOCKERHUB_USERNAME}/mybank_front
        //                 '
        //             """
        //         }
        //     }
        // }

        // stage('Run Next.js App') {
        //     steps {
        //         withCredentials([
        //             sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
        //         ]) {
        //             sh """
        //                 ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
        //                 docker stop mybank_front || true &&
        //                 docker rm mybank_front || true &&
        //                 docker run -d --name mybank_front -p 3000:3000 ${DOCKERHUB_USERNAME}/mybank_front
        //                 '
        //             """
        //         }
        //     }
        // }


        stage('Clone Backend Repository') {
            agent { node { label 'backend-agent' } }
            steps {
                git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
            }
        }

        stage('Install & Run Backend') {
            agent { node { label 'backend-agent' } }
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

        stage('Generate lexik jwt keypair') {
            steps {
                dir('api/config/jwt') {
                    sh 'mkdir -p .'
                    sh 'openssl genrsa -out private.pem 4096'
                    sh 'openssl rsa -pubout -in private.pem -out public.pem'
                }
            }
        }


        stage('Continuous Delivery / Livraison Continue api symfony') {
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
                    sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}" // Créer un PAT sur Docker Hub : https://app.docker.com/settings/personal-access-tokens
                    sh "docker push ${DOCKERHUB_USERNAME}/mybank_api"
                }
            }
        }


        stage('Pull Symfony Api Image on the server') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
                        mkdir -p ~/.ssh
                        ssh-keyscan -H ${REMOTE_HOST} >> ~/.ssh/known_hosts
                        ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                        docker pull ${DOCKERHUB_USERNAME}/mybank_api
                        '
                    """
                }
            }
        }

        stage('Run Symfony Api') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
                        ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                        docker stop mybank_api || true &&
                        docker rm mybank_api || true &&
                        docker network create app-network || true
                        docker run -d \
                          --name mybank_api \
                          --network app-network \
                          -e APP_ENV=prod \
                          -e DATABASE_URL=mysql://root:root@api-database:3306/mybank-api-database \
                          -e JWT_SECRET_KEY=/var/www/project/config/jwt/private.pem \
                          -e JWT_PUBLIC_KEY=/var/www/project/config/jwt/public.pem \
                          -e JWT_PASSPHRASE=93e0947637e070f643c0de5dd8bc8e397b173b7a06842236b015bdb394d46a29 \
                          -p 8083:80 \
                          ${DOCKERHUB_USERNAME}/mybank_api:latest
                        '
                    """
                }
            }
        }

        
    }
}


                        // docker run -d --name mybank_api -p 8083:80 ${DOCKERHUB_USERNAME}/mybank_api
