// pipeline {
//     agent any
    
//     environment {
//         AWS_REGION = 'us-east-1'
//         DOCKER_REGISTRY = credentials('DOCKER_HUB_USERNAME')
//         MONGODB_URI = credentials('MONGO_URI')
//         JWT_SECRET = credentials('SECRET')
//         // EC2_IP = credentials('EC2_IP')
//         // EC2_USER = 'ubuntu'
//         // KEY_PATH = '/var/lib/jenkins/jenkins-a.pem'
//     }
    
//     // tools {
//     //     nodejs 'node:18'
//     // }
    
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }
        
//         stage('Test Backend') {
//             steps {
//                 dir('backend') {
//                     // Limit Node.js memory usage and use less intensive install options
//                     sh 'npm install'
//                     sh 'npm test'
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

//         stage('Deploy to AWS') {
//             steps {
//                 script {
//                     echo "Deploying to AWS..."
//                 }
//             }
//         }
//     }
    
//     post {
//         always {
//             // Clean up to save memory
//             sh 'docker system prune -af'
//             cleanWs()
//         }
//         failure {
//             echo 'Deployment failed!'
//         }
//         success {
//             echo "Build completed successfully!"
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
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        EC2_IP = '100.29.93.61'
        EC2_DNS = credentials('EC2_DNS')
        EC2_INSTANCE_ID = credentials('EC2_INSTANCE_ID')
        SSH_KEY_PATH = credentials('SSH_KEY_PATH')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
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

        stage('Terraform Init and Apply') {
            steps {
                dir('terraform') {
                    // Create a tfvars file dynamically with sensitive data
                    writeFile file: 'terraform.tfvars', text: """
instance_id = "${EC2_INSTANCE_ID}"
"""
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }
        
        stage('Ansible Deploy') {
            steps {
                dir('ansible') {
                    // Create inventory file dynamically with instance details
                    writeFile file: 'inventory.ini', text: """
[qcode]
${EC2_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${SSH_KEY_PATH} ansible_ssh_common_args='-o StrictHostKeyChecking=no'
"""
                    
                    // Run Ansible playbook
                    sh '''
                    export ANSIBLE_HOST_KEY_CHECKING=False
                    ansible-playbook -i inventory.ini playbook.yml \
                    -e "docker_registry=${DOCKER_REGISTRY}" \
                    -e "mongodb_uri=${MONGODB_URI}" \
                    -e "jwt_secret=${JWT_SECRET}"
                    '''
                }
            }
        }
    }
    
    post {
        always {
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