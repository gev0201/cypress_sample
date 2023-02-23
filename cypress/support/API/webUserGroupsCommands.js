const endpoint = '/goanywhere/rest/gacmd/v1/webgroups'

function importWebUserGroup(body, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')) {
    cy.request({
        method: 'POST',
        url: `${endpoint}`,
        auth: {
            username: adminUser,
            password: adminPassword
        },
        body: body
    }).then((response) => {
        expect(response.status).to.be.eq(201);
    });
}

function deleteWebUserGroup(groupName, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')) {
    cy.request({
        method: 'DELETE',
        url: `${endpoint}/${groupName}`,
        auth: {
            username: adminUser,
            password: adminPassword
        }
    }).then((response) => {
        expect(response.status).to.be.eq(200);
    });
}

export default { importWebUserGroup, deleteWebUserGroup, endpoint }