import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to verify add web user with different folder permissions functionality', () => {
    let userData;
    before('prepare data', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.PasswordPolicy;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
            userData.VirtualFolder = {};
            userData.Features = ['HTTPS', 'Secure Folders'];
            userData.VirtualFolder.Folders = ["Test_Folder"];
        });
    });

    beforeEach('login to Admin UI, start given service if it is not started', () => {
        servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            if (response.body.data[0].status === "STOPPED") {
                serviceManagerPage.openServiceManagerPage();
                cy.startService(services.https.name);
            }
        });
    });

    it('test case is implemented to create web user without any secure folder permission and verify it\'s permissions in Web Client', () => {
        userData.GeneralFolders = [];
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('#messages .ui-messages-info-summary').should('be.visible');
        cy.loginClient(userData.username, userData.password);
        cy.get('.ui-button-text.ui-c').contains('Share').should('not.exist');
        cy.get('span').contains('New Folder').should('not.exist');
        cy.contains('This directory is empty.').should('be.visible');
        cy.get('button[id^="fileListForm"]').contains('Download').should('be.visible');
        cy.get('.ui-toolbar-group-left').children('button').contains('Upload').should('not.exist');
    });


    it('test case implemented to create web user with secure folder only List permission and verify it\'s permissions in Web Client', () => {
        userData.GeneralFolders = ["List"];
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('#messages .ui-messages-info-summary').should('be.visible');
        cy.loginClient(userData.username, userData.password);
        cy.get('[id $="data"]').contains('This directory is empty.').should('not.exist');
        userData.VirtualFolder.Folders.forEach(folder => {
            cy.get('tr > td').contains(folder);
        });
    });

    afterEach('Remove web user', () => {
        webUserCommands.deleteWebUser(userData.username);
    })
});