provider "aws" {
  region = var.aws_region
}

# Use data source to get information about the existing EC2 instance
data "aws_instance" "qcode_instance" {
  instance_id = var.instance_id
}

# Get the security group ID from the instance
locals {
  security_group_id = tolist(data.aws_instance.qcode_instance.vpc_security_group_ids)[0]
}

# Output the instance details
output "instance_id" {
  value = data.aws_instance.qcode_instance.id
}

output "instance_public_ip" {
  value = data.aws_instance.qcode_instance.public_ip
}

output "instance_public_dns" {
  value = data.aws_instance.qcode_instance.public_dns
}