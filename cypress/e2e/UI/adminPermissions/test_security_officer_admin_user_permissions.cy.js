import adminUsers from '/cypress/support/pages/admin_users/adminUsersPage.js';
import adminUserCommands from "../../../support/API/adminUserCommands.js";

describe('test suite implemented to test security officer admin user permissions', () => {
    let userData, links;
    before('login and create admin user with only security officer role', () => {
        cy.fixture('AdminUsers/Auditor').then((fixtureData) => {
            userData = fixtureData;
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            adminUsers.openAdminUsersPage();
            adminUsers.addNewAdminUser(userData);
            cy.getAdminUserLinks().then(data => links = data);
            cy.logout();
        });
    });

    beforeEach('login with Security Officer user', () => {
        cy.login(userData.username, userData.password);
    });

    it('test case implemented to login as admin user with only security officer role and verify correct menu items are displayed', () => {
        adminUsers.verifyAdminUserPermissionsByRole(userData.username);
    });

    it('test case is designed verify user can\'t open the no permission pages by navigating to the link via browser', () =>  {
        adminUsers.verifyNoPermissionLinksAreUnavailable(links);
    });

    after('remove admin user', () => {
        adminUserCommands.deleteAdminUser(userData.username, Cypress.env('adminUserName'), Cypress.env('adminPassword'));
    });
});