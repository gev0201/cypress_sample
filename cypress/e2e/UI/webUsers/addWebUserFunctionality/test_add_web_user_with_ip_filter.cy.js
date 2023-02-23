import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to test web user ip filter functionality', () => {
    let userData;
    before('prepare data, login to Admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
            userData.Features = ["HTTPS"];
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
            cy.getInstallDirectory().then((dir) => {
                cy.wrap(dir.text()).as('dir');
            });
        });
    });

    it('test case is implemented to verify the web user is created with ip filters', () => {
        userData.IpFilter = [];
        userData.IpFilter[0] = "Block";
        userData.IpFilter[1] = `${Cypress.env('host')}`;
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
    });

    it('test case is implemented to verify the ip filter is blocking on client side', () => {
        const errorMessage = "Invalid user name and/or password";
        const errorMessageLocator = '.ui-messages-error-summary'
        cy.loginClient(userData.username, userData.password, false);
        cy.verifyErrorMessage(errorMessage, errorMessageLocator);
        webUserCommands.deleteWebUser(userData.username);
    });
});