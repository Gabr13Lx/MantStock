pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "mantstock-web:jenkins"
        CONTAINER_NAME = "mantstock-jenkins-test"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código desde GitHub...'
                checkout scm
            }
        }

        stage('Pruebas') {
            steps {
                echo 'Ejecutando pruebas automatizadas de MantStock...'
                sh 'php tests/run-tests.php'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Construyendo imagen Docker...'
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Docker Run') {
            steps {
                echo 'Ejecutando contenedor para verificar...'
                sh "docker rm -f ${CONTAINER_NAME} || true"
                sh "docker run -d -p 8086:80 --name ${CONTAINER_NAME} --network mantstock-net ${DOCKER_IMAGE}"
                sh "sleep 5"
                sh "docker ps --filter name=${CONTAINER_NAME} --filter status=running | grep ${CONTAINER_NAME}"
            }
        }
    }
    post {
        always {
            echo 'Limpiando contenedor de pruebas...'
            sh "docker rm -f ${CONTAINER_NAME} || true"
        }
    }
}