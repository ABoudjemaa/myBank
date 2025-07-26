stage('Build & Push API Docker Image') {
        unstash 'symfony-prepared'
        dir('api') {
            sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_api"
            sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
            sh "docker push ${DOCKERHUB_USERNAME}/mybank_api"
        }
}

    stage('Deploy MySQL Database') {
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

    stage('Run Symfony API') {
        withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
            sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
              docker pull ${DOCKERHUB_USERNAME}/mybank_api:latest &&
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

    stage('Run DB Migrations') {
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
