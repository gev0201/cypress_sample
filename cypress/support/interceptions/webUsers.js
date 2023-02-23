const listWebUsers = () => {
    cy.intercept({
        method: 'POST',
        url: '/goanywhere/security/webusers/ListWebUsers.xhtml'
    }).as('listWebUsers');
};

const addWebUsers = () => {
    cy.intercept({
        method: 'POST',
        url: '/goanywhere/security/webusers/AddWebUser.xhtml'
    }).as('addWebUsers');
};

const webUserSettingsPage = () => {
    cy.intercept({
        method: 'POST',
        url: 'goanywhere/security/WebUserSecuritySettings.xhtml'
    }).as('webUserSettingsPage');
}

export {
    listWebUsers,
    addWebUsers,
    webUserSettingsPage
}