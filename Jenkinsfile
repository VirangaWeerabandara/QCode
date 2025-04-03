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
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        SKIP_TERRAFORM = "false"
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
                    sh 'docker build -t ${DOCKER_REGISTRY}/qcode-backend:${BUILD_VERSION} .'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${DOCKER_REGISTRY}/qcode-frontend:${BUILD_VERSION} .'
                }
            }
        }
        
        stage('Push Images') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_HUB_PASSWORD')]) {
                    sh '''
                    echo $DOCKER_HUB_PASSWORD | docker login -u ${DOCKER_REGISTRY} --password-stdin
                    docker push ${DOCKER_REGISTRY}/qcode-backend:${BUILD_VERSION}
                    docker push ${DOCKER_REGISTRY}/qcode-frontend:${BUILD_VERSION}
                    '''
                }
            }
        }
        
        stage('Check Infrastructure') {
            steps {
                script {
                    // Use AWS CLI to check if security group rules exist
                    withCredentials([
                        string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        sh '''
                        SG_ID=$(aws ec2 describe-instances --region ${AWS_REGION} --instance-ids ${EC2_INSTANCE_ID} --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text)
                        
                        # Check if ports 80, 443, and 3000 are open
                        HTTP_RULE=$(aws ec2 describe-security-groups --region ${AWS_REGION} --group-ids $SG_ID --query "SecurityGroups[0].IpPermissions[?FromPort==\`80\` && ToPort==\`80\`].IpRanges[?CidrIp==\`0.0.0.0/0\`]" --output text)
                        HTTPS_RULE=$(aws ec2 describe-security-groups --region ${AWS_REGION} --group-ids $SG_ID --query "SecurityGroups[0].IpPermissions[?FromPort==\`443\` && ToPort==\`443\`].IpRanges[?CidrIp==\`0.0.0.0/0\`]" --output text)
                        API_RULE=$(aws ec2 describe-security-groups --region ${AWS_REGION} --group-ids $SG_ID --query "SecurityGroups[0].IpPermissions[?FromPort==\`3000\` && ToPort==\`3000\`].IpRanges[?CidrIp==\`0.0.0.0/0\`]" --output text)
                        
                        # If all three rules exist, skip terraform
                        if [ ! -z "$HTTP_RULE" ] && [ ! -z "$HTTPS_RULE" ] && [ ! -z "$API_RULE" ]; then
                            echo "All required ports are already open. Skipping Terraform."
                            echo "true" > skip_terraform.txt
                        else
                            echo "Some ports need to be opened. Will apply Terraform."
                            echo "false" > skip_terraform.txt
                        fi
                        '''
                        
                        // Read the result back
                        env.SKIP_TERRAFORM = sh(script: 'cat skip_terraform.txt', returnStdout: true).trim()
                    }
                }
            }
        }

        stage('Terraform Init and Apply') {
            when {
                expression { return env.SKIP_TERRAFORM != "true" }
            }
            steps {
                dir('terraform') {
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
                    withCredentials([file(credentialsId: 'ec2-ssh-key-file', variable: 'SSH_KEY_FILE')]) {
                        sh 'cp $SSH_KEY_FILE ./ec2_key.pem'
                        sh 'chmod 600 ./ec2_key.pem'
                        
                        writeFile file: 'inventory.ini', text: """
[qcode]
${EC2_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${WORKSPACE}/ansible/ec2_key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
"""
                        
                        sh '''
                        ansible-playbook -i inventory.ini playbook.yml \
                        -e "docker_registry=${DOCKER_REGISTRY}" \
                        -e "mongodb_uri=${MONGODB_URI}" \
                        -e "jwt_secret=${JWT_SECRET}" \
                        -e "image_tag=${BUILD_VERSION}"
                        '''
                        
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