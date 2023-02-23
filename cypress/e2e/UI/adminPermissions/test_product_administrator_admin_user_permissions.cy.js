import adminUsers from '/cypress/support/pages/admin_users/adminUsersPage.js';
import adminUserCommands from "../../../support/API/adminUserCommands.js";

describe('test suite implemented to test product administrator admin user permissions', () => {
    let userData, links;
    before(() => {
        cy.fixture('AdminUsers/ProductAdministrator').then((fixtureData) => {
            userData = fixtureData;
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            adminUsers.openAdminUsersPage();
            adminUsers.addNewAdminUser(userData);
            cy.getAdminUserLinks().then(data => links = data);
            cy.logout();
        });
    });

    beforeEach('login with Product Administrator user', () => {
        cy.login(userData.username, userData.password);
    });

    it('test case implemented to login as admin user with only product administrator role and verify correct menu items are displayed', () => {
        adminUsers.verifyAdminUserPermissionsByRole(userData.username);
    });

    it('test case is designed verify user can\'t open the no permission pages by navigating to the link via browser', () =>  {
        adminUsers.verifyNoPermissionLinksAreUnavailable(links);
    });

    after('should remove admin user', () => {
        adminUserCommands.deleteAdminUser(userData.username, Cypress.env('adminUserName'), Cypress.env('adminPassword'));
    });
});