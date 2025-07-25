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

        stage('Frontend Pipeline') {
            agent { label 'front-agent' }
            steps {
                script {
                    load 'jenkins/frontend_install.groovy'
                }
            }
        }

        stage('Frontend build image Pipeline') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                script {
                    load 'jenkins/frontend_build_image.groovy'
                }
            }
        }

        // stage('Backend install Pipeline') {
        //     agent { node { label 'backend-agent' } }
        //     steps {
        //         script {
        //             load 'jenkins/backend_install.groovy'
        //         }
        //     }
        // }

        // stage('Backend build image Pipeline') {
        //     agent { label "${AGENT_DOCKER}" }
        //     steps {
        //         script {
        //             load 'jenkins/backend_build_image.groovy'
        //         }
        //     }
        // }



// stage('Test Backend') {
//     agent { node { label 'backend-agent' } }
//     steps {
//         dir('api') {
//             sh """
//                 echo \"APP_ENV=test
//                 APP_SECRET=${APP_SECRET}
//                 DATABASE_URL=mysql://root:root@127.0.0.1:3307/mybank_test
//                 CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
//                 JWT_SECRET_KEY=${JWT_SECRET_KEY}
//                 JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
//                 JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env
//             """
//             sh 'composer install'
//             sh 'php bin/console doctrine:database:create --env=test --if-not-exists'
//             sh 'php bin/console doctrine:migrations:migrate --env=test --no-interaction'

//             sh 'php bin/phpunit'

//             sh '''
//                 if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
//                   php bin/console lexik:jwt:generate-keypair
//                 fi
//             '''
//         }
//         stash name: 'symfony-prepared', includes: 'api/.env, api/config/jwt/**'
//     }
// }


        
    }
}


                        // docker run -d --name mybank_api -p 8083:80 ${DOCKERHUB_USERNAME}/mybank_api
