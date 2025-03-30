// pipeline {
//     agent any
    
//     environment {
//         AWS_REGION = 'us-east-1'
//         // TERRAFORM_DIR = 'terraform'
//         // ANSIBLE_DIR = 'ansible'
//         DOCKER_REGISTRY = credentials('DOCKER_HUB_USERNAME')
//         MONGODB_URI = credentials('MONGO_URI')
//         JWT_SECRET = credentials('jwt-secret')
//         // SSH_KEY_PATH = credentials('aws-ssh-key')
        
//     }
//     tools {
//         nodejs 'node:18'
//     }
    
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }
//         stage('Test Backend') {
//             steps {
//                 dir('backend') {
//                 sh 'npm install'
//                 sh 'npm test'
//                 }
//             }
//         }
//         stage('Build Backend') {
//             steps {
//                 dir('backend') {
//                     sh 'docker build -t ${DOCKER_REGISTRY}/qcode-backend:latest .'
//                 }
//             }
//         }
        
//         stage('Build Frontend') {
//             steps {
//                 dir('frontend') {
//                     sh 'docker build -t ${DOCKER_REGISTRY}/qcode-frontend:latest .'
//                 }
//             }
//         }
        
//         stage('Push Images') {
//             steps {
//                 withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_HUB_PASSWORD')]) {
//                     sh '''
//                     echo $DOCKER_HUB_PASSWORD | docker login -u ${DOCKER_REGISTRY} --password-stdin
//                     docker push ${DOCKER_REGISTRY}/qcode-backend:latest
//                     docker push ${DOCKER_REGISTRY}/qcode-frontend:latest
//                     '''
//                 }
//             }
//         }
        
//         // stage('Provision Infrastructure') {
//         //     steps {
//         //         dir(TERRAFORM_DIR) {
//         //             sh '''
//         //             terraform init
//         //             terraform apply -auto-approve
//         //             '''
                    
//         //             script {
//         //                 env.PUBLIC_IP = sh(script: 'terraform output -raw public_ip', returnStdout: true).trim()
//         //                 echo "EC2 public IP: ${env.PUBLIC_IP}"
//         //             }
//         //         }
//         //     }
//         // }
        
//         // stage('Deploy with Ansible') {
//         //     steps {
//         //         dir(ANSIBLE_DIR) {
//         //             sh '''
//         //             ansible-playbook -i inventory.yml playbook.yml \
//         //             -e "public_ip=${PUBLIC_IP}" \
//         //             -e "key_path=${SSH_KEY_PATH}" \
//         //             -e "backend_image=${DOCKER_REGISTRY}/qcode-backend:latest" \
//         //             -e "frontend_image=${DOCKER_REGISTRY}/qcode-frontend:latest" \
//         //             -e "mongodb_uri=${MONGODB_URI}" \
//         //             -e "jwt_secret=${JWT_SECRET}"
//         //             '''
//         //         }
//         //     }
//         // }
//     }
    
//     post {
//         failure {
//             echo 'Deployment failed!'
//         }
//         success {
//             echo "Deployment completed successfully! Application available at: http://${env.PUBLIC_IP}"
//         }
//     }
// }


pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        DOCKER_REGISTRY = credentials('DOCKER_HUB_USERNAME')
        MONGODB_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('SECRET')
        EC2_IP = credentials('EC2_IP')
        EC2_USER = 'ubuntu'
        KEY_PATH = '/var/lib/jenkins/jenkins-a.pem'
    }
    
    // tools {
    //     nodejs 'node:18'
    // }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    // Limit Node.js memory usage and use less intensive install options
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t ${DOCKER_REGISTRY}/qcode-backend:latest .'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${DOCKER_REGISTRY}/qcode-frontend:latest .'
                }
            }
        }
        
        stage('Push Images') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_HUB_PASSWORD')]) {
                    sh '''
                    echo $DOCKER_HUB_PASSWORD | docker login -u ${DOCKER_REGISTRY} --password-stdin
                    docker push ${DOCKER_REGISTRY}/qcode-backend:latest
                    docker push ${DOCKER_REGISTRY}/qcode-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                script {
                    echo "Deploying to AWS..."
                }
            }
        }
    }
    
    post {
        always {
            // Clean up to save memory
            sh 'docker system prune -af'
            cleanWs()
        }
        failure {
            echo 'Deployment failed!'
        }
        success {
            echo "Build completed successfully!"
        }
    }
}