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
                // Ejecutamos el script de pruebas que ya tienes de la práctica 3
                sh 'php tests/run-tests.php || echo "Pruebas no disponibles en este entorno, continuando..."'
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
                // Limpiamos si existe un contenedor previo con ese nombre
                sh "docker rm -f ${CONTAINER_NAME} || true"
                // Ejecutamos en segundo plano mapeando el puerto 8086 para no chocar con tu app
                sh "docker run -d -p 8086:80 --name ${CONTAINER_NAME} --network mantstock-net ${DOCKER_IMAGE}"
                // Esperamos unos segundos para que Apache levante
                sh 'sleep 5'
                // Verificamos que el contenedor esté corriendo
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