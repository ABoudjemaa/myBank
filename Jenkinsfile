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


        // stage('Clone Backend Repository') {
        //     agent { node { label 'backend-agent' } }
        //     steps {
        //         git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
        //     }
        // }

        // stage('Install Backend') {
        //     agent { node { label 'backend-agent' } }
        //     steps {
        //         dir('api') {
        //             sh """
        //                 echo \"APP_ENV=${APP_ENV}
        //                 APP_SECRET=${APP_SECRET}
        //                 DATABASE_URL=${DATABASE_URL}
        //                 CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
        //                 JWT_SECRET_KEY=${JWT_SECRET_KEY}
        //                 JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
        //                 JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env
        //             """
        //             sh 'composer install'
        //             sh '''
        //                 if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
        //                   php bin/console lexik:jwt:generate-keypair
        //                 fi
        //             '''
        //         }
        //     }
        // }

        // stage('Generate lexik jwt keypair') {
        //     agent { node { label 'backend-agent' } }
        //     steps {
        //         dir('api') {
        //             sh 'php /home/jenkins/workspace/mybank-pipeline/api/bin/console lexik:jwt:generate-keypair'
        //         }
        //     }
        // }


        stage('Continuous Delivery / Livraison Continue api symfony') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                dir('api') {
                    sh 'ls '
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

        stage('Run MySQL Database') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
                        ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                        docker stop api-database || true &&
                        docker rm api-database || true &&
                        docker network create app-network || true
                        docker run -d \
                          --name api-database \
                          --network app-network \
                          -e MYSQL_ROOT_PASSWORD=root \
                          -e MYSQL_DATABASE=mybank-api-database \
                          -p 3306:3306 \
                          mysql:9.0
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
                          docker network create app-network || true &&
                          docker run -d \\
                            --name mybank_api \\
                            --network app-network \\
                            -p 8083:80 \\
                            ${DOCKERHUB_USERNAME}/mybank_api:latest
                        '
                    """

                }
            }
        }


        stage('Run Migrations on Symfony Api') {
    steps {
        withCredentials([
            sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
        ]) {
            sh """
                ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                  sleep 10 && docker exec mybank_api php /var/www/project/bin/console doctrine:migrations:migrate --no-interaction
                '
            """
        }
    }
}


        
    }
}


                        // docker run -d --name mybank_api -p 8083:80 ${DOCKERHUB_USERNAME}/mybank_api
