#!/usr/bin/env groovy

this.mailRecipients = "roza.poghosyan@helpsystems.com;gevorg.gevorgyan@helpsystems.com;stella.tariverdyan@helpsystems.com;david.alaverdyan@helpsystems.com;astghik.yeranosyan@helpsystems.com;lusine.dallakyan@helpsystems.com;habet.muradyan@helpsystems.com;marc.delahousse@helpsystems.com;mike.woessner@helpsystems.com;cj.binder@helpsystems.com;brad.medinger@helpsystems.com"
this.jobName = currentBuild.fullDisplayName

pipeline {

   agent { label 'cypress_tests' }

    parameters{
        string(defaultValue: 'cypress/e2e/**/**', description: 'Enter test case file path to execute', name: "SPEC")
        string(defaultValue: 'master', description: 'Enter the branch name', name: "BRANCH")
        choice(choices: ['chrome', 'firefox', 'edge', 'electron'], description: 'Choose the browser', name: "BROWSER")
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages{

        stage('Testing'){
            steps{
                bat "npm prune node_modules"
                bat "npm install"
                bat "npx cypress run --browser ${BROWSER} --spec ${SPEC}"
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: "cypress/reports/index.html"
            }

        }

    }

    post{
        always{
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'cypress/reports', reportFiles: 'index.html', reportName: 'HTML report', reportTitles: ''])
            junit(testResults: 'cypress/reports/junit/*.xml')
            emailext body: '''${SCRIPT, template="groovy-html.template"}''',
                    mimeType: 'text/html',
                    subject: "[Cypress UI Test Report] ${jobName}",
                    to: "${mailRecipients}",
                    replyTo: "${mailRecipients}",
                    recipientProviders: [[$class: 'CulpritsRecipientProvider']]
        }
    }
}
