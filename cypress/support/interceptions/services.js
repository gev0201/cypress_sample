const listServices = () => {
    cy.intercept({
        method: 'POST',
        url: 'goanywhere/admin/services/ManageServers.xhtml'
    }).as('listServices');
}

export {
    listServices
}