require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JENKINS_URL: process.env.JENKINS_URL || 'http://localhost:8080',
  JENKINS_USER: process.env.JENKINS_USER || 'admin',
  JENKINS_TOKEN: process.env.JENKINS_TOKEN || '',
  GITEA_URL: process.env.GITEA_URL || 'http://localhost:3000',
  GITEA_TOKEN: process.env.GITEA_TOKEN || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  VAULT_ADDR: process.env.VAULT_ADDR || 'http://localhost:8200',
  VAULT_TOKEN: process.env.VAULT_TOKEN || '',
};

