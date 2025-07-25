stage('Clone Frontend Repository') {
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

stage('Install & Run Frontend') {
    dir('front') {
        // sh 'npm install'
        sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}' > .env"
    }
    
}
