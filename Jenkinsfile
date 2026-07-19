pipeline {
    agent any

    tools {
        nodejs 'Node22'
    }

    options {
        timestamps()

        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '10'
        ))
    }

    environment {
        APP_NAME   = 'employee-profile-frontend'
        IMAGE_NAME = 'employee-profile-frontend'
        IMAGE_TAG  = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'employee-profile-frontend'
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                bat 'node -v'
                bat 'npm -v'
                bat 'docker --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Angular Application') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build ^
                -t %IMAGE_NAME%:latest ^
                -t %IMAGE_NAME%:%IMAGE_TAG% ^
                .
                """
            }
        }

        stage('Deploy Docker Container') {
            steps {
                bat """
                docker rm -f %CONTAINER_NAME% 2>nul

                docker run -d ^
                --name %CONTAINER_NAME% ^
                -p 4200:80 ^
                --restart unless-stopped ^
                %IMAGE_NAME%:latest
                """
            }
        }

        stage('Docker Images') {
            steps {
                bat 'docker images'
            }
        }

        stage('Running Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {

        success {
            echo '======================================='
            echo 'BUILD SUCCESSFUL'
            echo "Application : ${APP_NAME}"
            echo "Image       : ${IMAGE_NAME}:${IMAGE_TAG}"
            echo "Container   : ${CONTAINER_NAME}"
            echo "Build No    : ${BUILD_NUMBER}"
            echo '======================================='
        }

        failure {
            echo '======================================='
            echo 'BUILD FAILED'
            echo "Application : ${APP_NAME}"
            echo "Build No    : ${BUILD_NUMBER}"
            echo '======================================='
        }

        always {
            cleanWs()
        }
    }
}