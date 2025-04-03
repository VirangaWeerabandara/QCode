provider "aws" {
  region = var.aws_region
}

# Use data source to get information about the existing EC2 instance
data "aws_instance" "qcode_instance" {
  instance_id = var.instance_id
}

# Get the security group ID from the instance
data "aws_security_group" "instance_sg" {
  id = data.aws_instance.qcode_instance.vpc_security_group_ids[0]
}

# Create a new security group rule for SSH
resource "aws_security_group_rule" "allow_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]  # WARNING: This allows SSH access from anywhere - consider restricting
  security_group_id = data.aws_security_group.instance_sg.id
  description       = "Allow SSH access"
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