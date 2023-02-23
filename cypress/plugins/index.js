/// <reference types="cypress" />
// ***********************************************************
// This example plugins/e2e.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const {beforeRunHook, afterRunHook} = require('cypress-mochawesome-reporter/lib');
const dotenv = require('dotenv');
const pg = require('pg');
dotenv.config({ path: ".env.local" });
dotenv.config();

module.exports = (on, config) => {
    on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
    });

    on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
    });

    let ms, mailServer, handler, port = 25;
    let lastEmail = {}
    ms = require('smtp-tester');
    mailServer = ms.init(port);

    handler = function (addr, id, email) {
        lastEmail[email.headers.to] = {
            receivers: email.receivers,
            data: email.data,
        }
    }
    mailServer.bind("test@hs.com", handler);

    on('task', {
        resetEmails(email) {
            if (email) {
                delete lastEmail[email]
            } else {
                lastEmail = {}
            }
            return null
        },

        getLastEmail(userEmail) {
            return lastEmail[userEmail] || null
        },

        pgDatabase({ dbConfig, sql }) {
            const pool = new pg.Pool(dbConfig);
            try {
                return pool.query(sql)
            } catch (e) {
            }
        }
    })

    config.env.host = process.env.HOST;
    config.env.adminPort = process.env.ADMIN_PORT;
    config.env.webUserPort = process.env.WEB_USER_PORT;
    config.env.adminUserName = process.env.ADMIN_USER_NAME;
    config.env.adminPassword = process.env.ADMIN_PASSWORD;
    config.env.apiEndpoint = process.env.API_ENDPOINT;
    config.env.db.host = process.env.DB_HOST;
    config.env.db.port = process.env.DB_PORT;
    config.env.db.database = process.env.DB_NAME;
    config.env.db.user = process.env.DB_USER;
    config.env.db.password = process.env.DB_PASSWORD;
    config.env.projectPath=process.env.PROJECT_PATH

    return config;
}
        