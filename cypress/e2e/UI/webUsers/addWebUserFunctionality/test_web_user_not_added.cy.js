import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to verify the web user is not created if provided data incorrect or exists', () => {
    let userData;
    before('prepare data, start a given service if it\'s not started', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.PasswordPolicy;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
        });
    });

    beforeEach('login to Admin UI', () => {
        servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            if (response.body.data[0].status === "STOPPED") {
                serviceManagerPage.openServiceManagerPage();
                cy.startService(services.https.name);
            }
        });

    });

    it('test case is implemented to verify the web user is not created with an existing user name', () => {
        userData.username = 'ExistingWebUserName';
        const errorMessage = `The specified User Name '${userData.username}' matches an existing User Name or Authentication Alias.`;
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData, false);
        webUsers.addNewWebUser(userData, false);
        cy.verifyErrorMessage(errorMessage);
        webUserCommands.deleteWebUser(userData.username);
    });

    it('test case is implemented to verify the web user is not created if username is not specified', () => {
        userData.username = " ";
        const errorMessage = 'User Name: Value is required.';
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData, false);
        cy.verifyErrorMessage(errorMessage);
    });

    it('test case is implemented to verify that web user is created and "No Email address" error message is displayed, when no email address is specified', () => {
        userData.emailAddress = '';
        userData.PasswordOptions = ['Email password'];
        const errorMessage = 'Failed to send email notification for the following reason: No recipient addresses.';
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        webUserCommands.deleteWebUser(userData.username);
    });
});