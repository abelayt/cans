def app
DOCKER_REGISTRY_CREDENTIALS_ID = '6ba8d05c-ca13-4818-8329-15d41a089ec0'

switch(env.BUILD_JOB_TYPE) {
  case "master": buildMaster(); break;
  case "acceptance": buildAcceptance(); break;
  default: buildPullRequest();
}

def buildPullRequest() {
  node('cans-slave') {
    try {
      checkoutStage()
      buildDockerImageStage()
      lintAndUnitTestStages()
      acceptanceTestStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def buildMaster() {
  node('cans-slave') {
    try {
      checkoutStage()
      buildDockerImageStage()
      lintAndUnitTestStages()
      acceptanceTestStage()
      publishImageStage()
      deployToPreintStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def buildAcceptance() {
  node('preint') {
    try {
      checkoutStage()
      acceptanceTestPreintStage()
      deployToIntegrationStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage()
    }
  }
}

def checkoutStage() {
  stage('Checkout') {
    deleteDir()
    checkout scm
  }
}

def buildDockerImageStage() {
  stage('Build Docker Image') {
    app = docker.build("cwds/cans:${env.BUILD_ID}", "-f docker/web/Dockerfile .")
  }
}

def lintAndUnitTestStages() {
  app.withRun("-e CI=true") { container ->
    lintStage(container)
    unitTestStage(container)
  }
}

def lintStage(container) {
  stage('Lint') {
    sh "docker exec -t ${container.id} rubocop"
  }
}

def unitTestStage(container) {
  stage('Unit Test') {
    sh "docker exec -t ${container.id} bash -c 'cd client && yarn test:coverage'"
    sh "docker exec -t ${container.id} rspec spec/routes"
  }
}

def acceptanceTestStage() {
  stage('Acceptance Test') {
    sh "docker-compose up -d --build"
    sh "sleep 120"
    sh "docker-compose exec -T --env CANS_AUTHORIZATION_ENABLED=true --env CANS_WEB_BASE_URL=cans-web:3000 cans-test bundle exec rspec spec/acceptance"
  }
}

def acceptanceTestPreintStage() {
  stage('Acceptance Test Preint') {
    sh "docker-compose up -d --build cans-test"
    sh "docker-compose exec -T --env CANS_AUTHORIZATION_ENABLED=true --env CANS_WEB_BASE_URL=https://cans.preint.cwds.io cans-test bundle exec rspec spec/acceptance"
  }
}

def publishImageStage() {
  stage('Publish to Dockerhub') {
    withDockerRegistry([credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID]) {
      app.push()
      app.push('latest')
    }
  }
}

def deployToPreintStage() {
  stage('Deploy to Preint') {
      withCredentials([usernameColonPassword(credentialsId: 'fa186416-faac-44c0-a2fa-089aed50ca17', variable: 'jenkinsauth')]) {
        sh "curl -u $jenkinsauth 'http://jenkins.mgmt.cwds.io:8080/job/preint/job/deploy-cans/buildWithParameters?token=deployPreint&version=${env.BUILD_ID}'"
    }
  }
}

def deployToIntegrationStage() {
  stage('Deploy Integration') {
    build job: '/Integration Environment/deploy-cans/',
          parameters: [
            string(name: 'APP_VERSION', value : "${APP_VERSION}"),
            string(name: 'inventory', value: 'inventories/integration/hosts.yml')
          ],
          wait: false
  }
}

def cleanupStage() {
  stage('Cleanup') {
    sh "docker-compose down"
    cleanWs()
  }
}
