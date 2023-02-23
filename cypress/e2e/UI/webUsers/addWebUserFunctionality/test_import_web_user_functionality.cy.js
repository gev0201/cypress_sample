import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to check import web user functionality', () => {
    let userData;
    before('prepare data', () => {
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

    beforeEach('login to Admin UI, start given service if it is not started', () => {
        servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            if (response.body.data[0].status === "STOPPED") {
                serviceManagerPage.openServiceManagerPage();
                cy.startService(services.https.name);
            }
        });
    });

    it('test case is implemented to verify importing a web user from XML', () => {
        userData.username = "Test_User_XML";
        webUsers.openWebUsersPage();
        webUsers.importWebUser('\\WebUsers\\allPermissionWebUser.xml', 'XML');
        cy.verifySuccessMessages(['Web user \'' + userData.username + '\' was added successfully.']);
        cy.loginClient(userData.username, userData.password);
        webUserCommands.deleteWebUser(userData.username);
    });

    it('testcase is implemented to verify importing web users from CSV', () => {
        userData.username = "Test_User_CSV";
        webUsers.openWebUsersPage();
        webUsers.importWebUser('\\WebUsers\\emptyWebUser.csv', 'CSV');
        webUsers.addFeatures(userData.username, ['HTTPS']);
        cy.loginClient(userData.username, userData.password);
        webUserCommands.deleteWebUser(userData.username);
    });
});