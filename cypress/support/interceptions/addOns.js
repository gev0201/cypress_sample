const listAddOns = () => {
    cy.intercept({
        method: 'POST',
        url: 'goanywhere/admin/addon/ListAddons.xhtml'
    }).as('listAddOns');
}

export {
    listAddOns
}