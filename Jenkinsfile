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
                    // Use the secret file credential
                    withCredentials([file(credentialsId: 'ec2-ssh-key-file', variable: 'SSH_KEY_FILE')]) {
                        // Make sure the key has proper permissions (required for SSH)
                        sh 'cp $SSH_KEY_FILE ./ec2_key.pem'
                        sh 'chmod 600 ./ec2_key.pem'
                        
                        // Create inventory file with the local key file
                        writeFile file: 'inventory.ini', text: """
[qcode]
${EC2_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${WORKSPACE}/ansible/ec2_key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
"""
                        
                        // Run Ansible playbook
                        sh '''
                        export ANSIBLE_HOST_KEY_CHECKING=False
                        ansible-playbook -i inventory.ini playbook.yml \
                        -e "docker_registry=${DOCKER_REGISTRY}" \
                        -e "mongodb_uri=${MONGODB_URI}" \
                        -e "jwt_secret=${JWT_SECRET}"
                        '''
                        
                        // Clean up the key file
                        sh 'rm -f ./ec2_key.pem'
                    }
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