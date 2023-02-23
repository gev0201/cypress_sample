const endpoints = {
    projects: '/goanywhere/rest/gacmd/v1/projects',
    resources: '/goanywhere/rest/gacmd/v1/resources'
}

function deleteProject(body, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')) {
    cy.request({
        method: 'POST',
        url: `${endpoints.projects}/`,
        auth: {
            username: adminUser,
            password: adminPassword
        },
        body: body
    }).then((response) => {
        expect(response.status).to.be.eq(200);
    });
}

function deleteResource(resourceType, resourceName, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')) {
    cy.request({
        method: 'DELETE',
        url: `${endpoints.resources}/${resourceType}/${resourceName}`,
        auth: {
            username: adminUser,
            password: adminPassword
        }
    }).then((response) => {
        expect(response.status).to.be.eq(200);
    });
}

export default {deleteProject, deleteResource, endpoints}