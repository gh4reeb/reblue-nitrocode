#!/bin/bash

VAULT_ADDR="${VAULT_ADDR:-http://localhost:8200}"
VAULT_SECRET_PATH="${VAULT_SECRET_PATH:-secret/devsecops}"
JENKINS_URL="${JENKINS_URL:-http://localhost:8080}"
JENKINS_CLI_JAR="${JENKINS_CLI_JAR:-/var/jenkins_home/war/WEB-INF/jenkins-cli.jar}"
JENKINS_USER="${JENKINS_USER:-admin}"
JENKINS_TOKEN="${JENKINS_TOKEN:-admin}" # Replace with actual token or pass via argument

SCHEDULE_CRON=""
OUTPUT_FILE="Jenkinsfile"

declare -A SECRETS
declare -A CONFIG

show_help() {
    echo "Usage: ./lazydevsecops.sh [OPTIONS]"
    echo "Example: ./lazydevsecops.sh -o testjenkinsfile"
    echo "Options:"
    echo "  -sonar-token <value>       Add SonarQube token"
    echo "  -vault-skip                Skip Vault storage"
    echo "  -jenkins-cron '<cron_exp>' Enable scheduled Jenkins job (e.g., '0 2 * * *')"
    echo "  -o, --output <filename>    Specify output Jenkinsfile name (default: Jenkinsfile)"
    echo "  -jenkins-user <username>   Jenkins username (default: admin)"
    echo "  -jenkins-token <token>     Jenkins API token (default: admin)"
    echo "  --help                     Show this help message"
}

if [[ $# -eq 0 ]]; then
    echo "No arguments provided. Use --help for options."
    exit 1
fi

while [[ $# -gt 0 ]]; do
    case "$1" in
        -s|--sonar-token)
            SECRETS["sonar-token"]="$2"
            shift 2
            ;;
        -v|--vault-skip)
            CONFIG["vault-skip"]=true
            shift
            ;;
        -j|--jenkins-cron)
            SCHEDULE_CRON="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -u|--jenkins-user)
            JENKINS_USER="$2"
            shift 2
            ;;
        -t|--jenkins-token)
            JENKINS_TOKEN="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Store Secrets in Vault if available
if command -v vault &> /dev/null && [[ -z ${CONFIG["vault-skip"]} ]]; then
    echo "🔐 Storing secrets in HashiCorp Vault..."
    for key in "${!SECRETS[@]}"; do
        vault kv put "$VAULT_SECRET_PATH" "$key=${SECRETS[$key]}"
    done
else
    echo "⚠️ Vault not found or skipped. Credentials will NOT be stored securely!"
fi

# Generate Jenkinsfile
echo "📝 Generating $OUTPUT_FILE..."
cat > "$OUTPUT_FILE" <<EOF
pipeline {
    agent any
    environment {
EOF

if [[ -n ${SECRETS["sonar-token"]} ]]; then
    echo '        SONARQUBE_TOKEN = credentials("sonar-token")' >> "$OUTPUT_FILE"
else
    echo '        // Skipping SonarQube due to missing credentials' >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" <<EOF
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/sample-app.git'
            }
        }
EOF

if [[ -n ${SECRETS["sonar-token"]} ]]; then
cat >> "$OUTPUT_FILE" <<EOF
        stage('SAST - Static Code Analysis (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar -Dsonar.projectKey=SampleProject -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=$SONARQUBE_TOKEN'
                }
            }
        }
EOF
else
    echo "Skipping SonarQube stage..."
fi

cat >> "$OUTPUT_FILE" <<EOF
    }
    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
    }
}
EOF

echo "✅ Jenkinsfile created: $OUTPUT_FILE"

# Download Jenkins CLI if not found
if [[ ! -f "$JENKINS_CLI_JAR" ]]; then
    echo "📥 Downloading Jenkins CLI..."
    curl -o "$JENKINS_CLI_JAR" "http://$JENKINS_URL/jnlpJars/jenkins-cli.jar"
    if [[ $? -ne 0 ]]; then
        echo "❌ Failed to download Jenkins CLI. Jenkins job not created."
        exit 1
    fi
fi

# Configure Jenkins Scheduled Job if required
if [[ -n "$SCHEDULE_CRON" ]]; then
    echo "⏳ Setting up scheduled Jenkins job ($SCHEDULE_CRON)..."
    if [[ -f "$JENKINS_CLI_JAR" ]]; then
        echo "<flow-definition plugin=\"workflow-job@2.39\">
  <description>DevSecOps Pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class=\"org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition\" plugin=\"workflow-cps@2.87\">
    <script>pipeline {
    agent any
    triggers {
        cron('$SCHEDULE_CRON')
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>" > /tmp/job-config.xml

        java -jar "$JENKINS_CLI_JAR" -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" create-job DevSecOps-Pipeline < /tmp/job-config.xml
        echo "✅ Jenkins job scheduled."
    else
        echo "⚠️ Jenkins CLI not found! Jenkins job not created. You can manually configure it."
    fi
fi

echo "🎉 Script execution completed!"
