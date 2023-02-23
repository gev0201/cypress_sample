import adminUserCommands from "../../support/API/adminUserCommands.js";
import adminUsers from "../../support/pages/admin_users/adminUsersPage.js";

describe('test suite is implemented to test delete admin user action', () => {
    let userData;
    before('should login and create a test admin user', () => {
        cy.fixture('AdminUsers/TestUser').then((fixtureData) => {
            userData = fixtureData;
            cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
            adminUsers.openAdminUsersPage();
            adminUsers.addNewAdminUser(userData);
        });
    });

    it('test case is implemented to verify error message when credentials are not specified', () => {
        cy.request({
            method: 'DELETE',
            url: `${adminUserCommands.endpoint}/${userData.username}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.be.eq(401);
            expect(response.body).to.be.eq('Missing Authorization Header');
        });
    });

    it('test case is implemented to verify error message when the user does not exist', () => {
        cy.request({
            method: 'DELETE',
            url: `${adminUserCommands.endpoint}/NotExistingUserName`,
            failOnStatusCode: false,
            auth: {
                username: `${Cypress.env('adminUserName')}`,
                password: `${Cypress.env('adminPassword')}`
            }
        }).then((response) => {
            expect(response.status).to.be.eq(401);
            expect(response.body).to.be.eq('Admin user \'root\' does not have sufficient authority to execute the \'deleteAdminUser\' command. Please use a different user name.');
        });
    });

    after('should remove admin user', () => {
        adminUserCommands.deleteAdminUser(userData.username, Cypress.env('adminUserName'), Cypress.env('adminPassword'));
    });
});