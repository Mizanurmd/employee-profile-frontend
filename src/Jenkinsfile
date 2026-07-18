pipeline {
    agent any

    tools {
        nodejs 'Node22'
    }

    options {
        timestamps()
    }

    environment {
        APP_NAME = 'employee-profile-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Node Version') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Angular') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Angular Build Successful'
        }

        failure {
            echo 'Angular Build Failed'
        }

        always {
            cleanWs()
        }
    }
}