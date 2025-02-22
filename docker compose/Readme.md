# DevSecOps Pipeline Deployment

This guide provides step-by-step instructions to deploy the DevSecOps pipeline using Docker.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Deployment Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/devsecops-pipeline.git
cd devsecops-pipeline
```
### 2. Start the stack:
```docker-compose up -d```

## Access the services:
``Jenkins: http://localhost:8080``
``Gitea: http://localhost:3000``
``SonarQube: http://localhost:9000``
``ZAP API: http://localhost:8090``
``Vault: http://localhost:8200``
