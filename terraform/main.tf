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

# Get the security group
data "aws_security_group" "instance_sg" {
  id = local.security_group_id
}

# Add HTTP port
resource "aws_security_group_rule" "allow_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = data.aws_security_group.instance_sg.id
  description       = "Allow HTTP traffic"
}

# Add HTTPS port
resource "aws_security_group_rule" "allow_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = data.aws_security_group.instance_sg.id
  description       = "Allow HTTPS traffic"
}

# Add application-specific port for backend API
resource "aws_security_group_rule" "allow_backend" {
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = data.aws_security_group.instance_sg.id
  description       = "Allow backend API traffic"
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