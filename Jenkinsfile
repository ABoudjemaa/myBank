pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ABoudjemaa/myBank.git'
            }
        }

//         stage('Frontend Pipeline') {
//             agent { label 'front-agent' }
//             steps {
//                 script {
//                     load 'jenkins/frontend_install.groovy'
//                 }
//             }
//         }
//
//         stage('Frontend build image Pipeline') {
//             agent { label "${AGENT_DOCKER}" }
//             steps {
//                 script {
//                     load 'jenkins/frontend_build_image.groovy'
//                 }
//             }
//         }

        stage('Backend install Pipeline') {
            agent { node { label 'backend-agent' } }
            steps {
                script {
                    load 'jenkins/backend_install.groovy'
                }
            }
        }

//         stage('Test Backend') {
// //             agent { node { label 'backend-agent' } }
//             steps {
//                 script {
//                     load 'jenkins/backend_test.groovy'
//                 }
//             }
//         }

        stage('Backend build image Pipeline') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                script {
                    load 'jenkins/backend_build_image.groovy'
                }
            }
        }


    }
}