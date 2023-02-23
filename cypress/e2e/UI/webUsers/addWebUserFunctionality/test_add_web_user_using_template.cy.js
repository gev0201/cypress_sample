import webUserTemplatesPage from '/cypress/support/pages/webUsers/webUserTemplatesPage.js';
import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is designed to verify add web user within template functionality', () => {
    let userData;
    before('prepare data, login to Admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.PasswordPolicy;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
            delete userData.Features;
            userData.template = "Test_Template";
            userData.password = "auto";
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
            webUserTemplatesPage.openWebUserTemplatesPage();
            webUserTemplatesPage.addWebUserTemplate(userData);
            cy.getInstallDirectory().then((dir) => {
                cy.wrap(dir.text()).as('dir');
            });
        });
    });

    it('test case is implemented to verify the web user created according to the selected template', () => {
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData, true);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
    });

    after('Remove web user template', () => {
        webUserTemplatesPage.openWebUserTemplatesPage();
        webUserTemplatesPage.deleteWebUserTemplate(userData);
        webUserCommands.deleteWebUser(userData.username);
    });
});