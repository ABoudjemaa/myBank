stage('Build & Push Frontend Docker Image') {
    deleteDir()
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
    dir('front') {
        sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
        sh "docker build .  -t ${DOCKERHUB_USERNAME}/mybank_front:latest"
        sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
        sh "docker push ${DOCKERHUB_USERNAME}/mybank_front:latest"
    }
}

stage('Deploy Frontend') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                docker pull ${DOCKERHUB_USERNAME}/mybank_front:latest &&
                docker stop mybank_front || true &&
                docker rm mybank_front || true &&
                docker run -d --name mybank_front -p 3001:3000 ${DOCKERHUB_USERNAME}/mybank_front:latest
            '
        """
    }
}
