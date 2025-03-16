provider "aws" {
  region = var.aws_region
}

# Create VPC
resource "aws_vpc" "qcode_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "qcode-vpc"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "qcode_igw" {
  vpc_id = aws_vpc.qcode_vpc.id
  tags = {
    Name = "qcode-igw"
  }
}

# Create Public Subnet
resource "aws_subnet" "qcode_public_subnet" {
  vpc_id                  = aws_vpc.qcode_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = {
    Name = "qcode-public-subnet"
  }
}

# Create Route Table
resource "aws_route_table" "qcode_public_rt" {
  vpc_id = aws_vpc.qcode_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.qcode_igw.id
  }
  tags = {
    Name = "qcode-public-route-table"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "qcode_public_rta" {
  subnet_id      = aws_subnet.qcode_public_subnet.id
  route_table_id = aws_route_table.qcode_public_rt.id
}

# Create Security Group
resource "aws_security_group" "qcode_sg" {
  name        = "qcode-sg"
  description = "Allow SSH, HTTP, HTTPS, and application ports"
  vpc_id      = aws_vpc.qcode_vpc.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend
  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "qcode-security-group"
  }
}

# Create EC2 Instance
resource "aws_instance" "qcode_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.qcode_public_subnet.id
  vpc_security_group_ids = [aws_security_group.qcode_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "qcode-instance"
  }
}

# Output IP Address
output "public_ip" {
  value = aws_instance.qcode_instance.public_ip
}