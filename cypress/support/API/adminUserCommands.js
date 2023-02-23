const endpoint = '/goanywhere/rest/gacmd/v1/adminusers'

function deleteAdminUser(userName, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')) {
    cy.request({
        method: 'DELETE',
        url: `${endpoint}/${userName}`,
        auth: {
            username: adminUser,
            password: adminPassword
        }
    }).then((response) => {
        expect(response.status).to.be.eq(200);
    });
}

export default {deleteAdminUser, endpoint}