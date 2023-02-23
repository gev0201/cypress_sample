import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import myProfile from '/cypress/support/pages/webClient/myProfile.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import {services} from "../../../fixtures/Services/serviceNames";
import serviceManagerPage from "../../../support/pages/services/serviceManagerPage";
import servicesCommands from "../../../support/API/servicesCommands";

describe('test suite is implemented to test allow web user to change password functionality', () => {
    let userData;
    before('prepare data, login to Admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData);
        servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            if (response.body.data[0].status === "STOPPED") {
                serviceManagerPage.openServiceManagerPage();
                cy.startService(services.https.name);
            }
        });
    });

    it('test case is designed to verify the web user is created with option Allow User to Change Password', () => {
        userData.PasswordOptions = ['Allow User to Change Password'];
        delete userData.VirtualFolder;
        delete userData.AddressBooks;
        delete userData.IpFilter;
        cy.getInstallDirectory().then((dir) => {
            webUsers.openWebUsersPage();
            webUsers.addNewWebUser(userData);
            webUsers.verifyWebUserCreated(userData, dir.text());
        });
    });

    it('test case is designed to verify that Change Password option is working on web client side', () => {
        cy.loginClient(userData.username, userData.password);
        myProfile.WebClientChangePassword(userData);
        myProfile.WebClientlogout();
        cy.loginClient(userData.username, userData.password);
    });

    after('should remove web user', () => {
        webUserCommands.deleteWebUser(userData.username);
    });
});