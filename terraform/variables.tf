variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1
}

variable "instance_type" {
  description = "Instance type for the EC2 instance"
  default     = "t2.medium"
}

variable "key_name" {
  description = "Key pair name for SSH access"
  default     = "qcode-key"
}