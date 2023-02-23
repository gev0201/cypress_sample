import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserGroupsCommands from '/cypress/support/API/webUserGroupsCommands.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js';
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to verify add web user within web user groups functionality', () => {
    let userData, groupData;
    before('prepare data, login to Admin UI', () => {
        cy.fixture('WebUserGroups/allPermissionWebUserGroup').then(fixtureData => groupData = fixtureData).then(() => {
            webUserGroupsCommands.importWebUserGroup(groupData);
        });
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
            cy.getInstallDirectory().then((dir) => {
                cy.wrap(dir.text()).as('dir');
            });
        });
    });

    it('test case implemented to verify the web user is created within web user group', () => {
        userData.UserGroups = ['Test_User_Group'];
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        cy.selectMoreAction(userData.username, "View");
        cy.contains(userData.UserGroups[0]).scrollIntoView().should('be.visible');
    });

    after('remove web user and web user group', () => {
        webUserCommands.deleteWebUser(userData.username);
        webUserGroupsCommands.deleteWebUserGroup('Test_User_Group');
    })
});