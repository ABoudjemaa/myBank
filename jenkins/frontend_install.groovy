stage('Clone Frontend Repository') {
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

stage('Install & Run Frontend') {
    dir('front') {
        sh 'npm install'
        sh 'ls -la'
        sh "echo 'NEXT_PUBLIC_API_BASE_URL=http://backend-1/api' > .env"
        sh 'cat .env'
        sh 'npx vitest run'
    }
    
}
