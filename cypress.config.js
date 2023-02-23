const {defineConfig} = require("cypress");
const setupNodeEvents = require('./cypress/plugins/index.js');

module.exports = defineConfig({
    e2e: {
        baseUrl: `https://${process.env.HOST}:${process.env.ADMIN_PORT}/`,
        numTestsKeptInMemory: 0,
        defaultCommandTimeout: 15000,
        viewportHeight: 1000,
        viewportWidth: 1500,
        video: true,
        videoUploadOnPasses: false,
        videoCompression: false,
        experimentalSessionAndOrigin: true,
        env: {
           db: {}
        },
        reporter: 'cypress-multi-reporters',
        reporterOptions: {
            reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
            cypressMochawesomeReporterReporterOptions: {
                inlineAssets: true,
                reportDir: 'cypress/reports',
                overwrite: true,
                html: true,
                json: true
            },
            mochaJunitReporterReporterOptions: {
                mochaFile: "cypress/reports/junit/results-[hash].xml",
                jenkinsMode: true
            }


        },
        setupNodeEvents
    }
});
