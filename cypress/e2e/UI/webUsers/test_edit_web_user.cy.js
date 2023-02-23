import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import myProfile from '/cypress/support/pages/webClient/myProfile.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js';
import serviceManagerPage from "../../../support/pages/services/serviceManagerPage";
import {services} from "../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../support/API/servicesCommands";

describe('test suite is implemented to test edit web user functionality', () => {
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
            userData.Features = ["HTTPS"];
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
        });

    });

    it('test case is designed to verify the web user is updated after editing', () => {
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.selectMoreAction(userData.username, 'Edit');
        cy.get('[id="editUserGrid:firstName"]').should('be.visible').click().type('test first name');
        cy.get('[id="btnSave"]').should('not.be.disabled').click();
        cy.selectMoreAction(userData.username, 'View');
        cy.get('span').contains('test first name').should('be.visible');
    });

    it('test case is designed to verify that web user data updated on client side', () => {
        cy.loginClient(userData.username, userData.password);
        myProfile.WebClientOpenActionMenuItem('Update Profile');
        cy.get('[id $="firstName"][value = "test first name"]');
    });

    after('should remove web user', () => {
        webUserCommands.deleteWebUser(userData.username);
    });
});