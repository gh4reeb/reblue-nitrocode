# reblue-nitrocode
A comprehensive, open-source DevSecOps pipeline deployable with minimal effort. Ideal for developers and organizations seeking streamlined, secure CI/CD processes.

# README.md

# ReBlue NitroCode - One-Click DevSecOps Pipeline

## Overview
ReBlue NitroCode is an open-source, one-click DevSecOps pipeline that integrates CI/CD, security scanning, and containerization.

## Features
- Automated CI/CD with Jenkins
- Secure version control with GitHub/Gitea
- Static & Dynamic security analysis (SonarQube, OWASP ZAP)
- Secrets management with HashiCorp Vault
- Easy deployment using Docker Compose

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/gh4reeb/reblue-nitrocode.git
   cd reblue-nitrocode
   ```
2. Start services using Docker Compose:
```sh
docker-compose up -d
```
3. Access the application:
```Frontend: http://localhost:3000```
```Backend API: http://localhost:5000/api```

## Configuration
 Edit .env to modify API URLs, credentials, and environment settings.

## Contributing
Feel free to submit issues and pull requests to enhance the project.

# DevSecOps Pipeline can be deployed seperatedly located in *docker compose* folder
