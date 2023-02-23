const endpoint = '/goanywhere/rest/gacmd/v1/webusers'

function deleteWebUser(userName) {
    cy.request({
        method: 'DELETE',
        url: `${endpoint}/${userName}`,
        auth: {
            username: `${Cypress.env('adminUserName')}`,
            password: `${Cypress.env('adminPassword')}`
        }
    }).then((response) => {
        expect(response.status).to.be.eq(200);
    });
}

export default {deleteWebUser, endpoint}