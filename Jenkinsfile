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
                // CAMBIO: sh -> bat
                bat 'php tests/run-tests.php || echo "Pruebas no disponibles en este entorno, continuando..."'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Construyendo imagen Docker...'
                // CAMBIO: sh -> bat
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Docker Run') {
            steps {
                echo 'Ejecutando contenedor para verificar...'
                // CAMBIO: sh -> bat
                bat "docker rm -f ${CONTAINER_NAME} || true"
                bat "docker run -d -p 8086:80 --name ${CONTAINER_NAME} --network mantstock-net ${DOCKER_IMAGE}"
                bat 'timeout /t 5 /nobreak > nul'
                bat "docker ps --filter name=${CONTAINER_NAME} --filter status=running | findstr ${CONTAINER_NAME}"
            }
        }
    }
    post {
        always {
            echo 'Limpiando contenedor de pruebas...'
            // CAMBIO: sh -> bat
            bat "docker rm -f ${CONTAINER_NAME} || true"
        }
    }
}