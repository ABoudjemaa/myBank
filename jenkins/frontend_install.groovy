stage('Clone Frontend Repository') {
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

stage('Install & Run Frontend') {
    dir('front') {
        sh 'npm install'
        sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
    }
}

stage('Build & Push Frontend Docker Image') {
    dir('front') {
        sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_front"
        sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
        sh "docker push ${DOCKERHUB_USERNAME}/mybank_front"
    }
}

stage('Deploy Frontend') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root-level-up-api-server', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                docker stop mybank_front || true &&
                docker rm mybank_front || true &&
                docker run -d --name mybank_front -p 3000:3000 ${DOCKERHUB_USERNAME}/mybank_front
            '
        """
    }
}
