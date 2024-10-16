packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba" # Ubuntu 24.04 LTS us-east-1
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-08b7aaccb1c0bf34b"
}

source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_f24_app_${formatdate("YYYY_MM_DD", timestamp())}"
  ami_description = "AMI for CSYE-6225 A04"
  ami_regions = [
    "us-east-1",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.small"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}


build {
  sources = [
    "source.amazon-ebs.my-ami",
  ]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "nodeInstaller.sh"
    destination = "/tmp/nodeinstaller.sh"
  }

  provisioner "file" {
    source      = "userAndGroup.sh"
    destination = "/tmp/userAndGroup.sh"
  }

  provisioner "file" {
    source      = "nodeApp.sh"
    destination = "/tmp/nodeApp.sh"
  }

  provisioner "file" {
    source      = "databaseSetup.sh"
    destination = "/tmp/databaseSetup.sh"
  }

  provisioner "shell" {
    script = "nodeInstaller.sh"
  }

  provisioner "shell" {
    script = "databaseSetup.sh"
  }

  provisioner "shell" {
    script = "userAndGroup.sh"
  }

  provisioner "shell" {
    script = "nodeApp.sh"
  }


}