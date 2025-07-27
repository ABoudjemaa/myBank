stage('Clone Frontend Repository') {
    git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
}

dir('front') {
    sh "echo 'NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_TEST_URL}' > .env"
    sh 'cat .env'
    sh 'npm install dotenv'  // si vraiment nécessaire, sinon déjà dans package.json
    sh 'npm install'
    sh 'npx vitest run'
}

