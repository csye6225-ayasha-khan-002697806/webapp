packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "database" {
  type = string
  # default = env("DATABASE")
  default = "csye6225"
}

variable "db_username" {
  type = string
  # default = env("DB_USERNAME")
  default = "csye6225"
}

variable "db_password" {
  type = string
  # default = env("DB_PASSWORD")
  default = "Ayasha12!"
}

variable "node_env" {
  type = string
  # default = env("NODE_ENV")
  default = "PROD"
}

variable "port" {
  type = number
  # default = env("PORT")
  default = 3000
}

variable "host" {
  type = string
  # default = env("HOST")
  default = "localhost"
}

variable "db_dialect" {
  type = string
  # default = env("DB_DIALECT")
  default = "postgres"
}


variable "aws_region" {
  type    = string
  default = "us-east-1"
  # default = env("AWS_REGION")
}

variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba" # Ubuntu 24.04 LTS us-east-1
  # default = env("SOURCE_AMI")
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
  # default = env("SSH_USERNAME")
}

variable "subnet_id" {
  type    = string
  default = "subnet-08b7aaccb1c0bf34b"
  # default = env("SUBNET_ID")
}

source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_fall24_app_2024_10_17_{{timestamp}}"
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


  provisioner "shell" {
    environment_vars = ["DATABASE=${var.database}",
      "DB_USERNAME=${var.db_username}",
      "DB_PASSWORD=${var.db_password}",
      "NODE_ENV=${var.node_env}"
    ]

    scripts = [
      "./nodeInstaller.sh",
      // "./envSetup.sh",
      // "./databaseSetup.sh",

    ]
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "nodeApp.service"
    destination = "/tmp/nodeApp.service"
  }

  provisioner "file" {
    source      = "cloudwatch-config.json"
    destination = "/tmp/cloudwatch-config.json"
  }

  provisioner "shell" {
    environment_vars = ["DATABASE=${var.database}",
      "DB_USERNAME=${var.db_username}",
      "DB_PASSWORD=${var.db_password}",
      "PORT=${var.port}",
      "HOST=${var.host}",
      "NODE_ENV=${var.node_env}",
    "DB_DIALECT=${var.db_dialect}"]

    scripts = [
      "./userAndGroup.sh",
      "./nodeApp.sh",
      "./cloudwatch-install.sh",
    ]
  }


}
