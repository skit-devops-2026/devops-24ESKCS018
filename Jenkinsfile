pipeline {
environment {
    PATH = "/usr/local/bin:${env.PATH}"
}
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'echo Build completed successfully'
            }
        }
    }
}