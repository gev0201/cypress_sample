const locators = {
    AccountLink: "[id = 'accountLink']",
    AccountMenu: "[id = 'accountMenu']",
    ChangePasswordButton: "[id = 'btnChange']",
    LogoutButton: "[id = 'logoutLink']"
}

function WebClientOpenActionMenuItem(action) {
    cy.get(locators.AccountLink).click();
    cy.get(locators.AccountMenu).should('be.visible');
    cy.get('span').contains(action).click();
}

function WebClientChangePassword(userData) {
    WebClientOpenActionMenuItem('Change Password')
    cy.get('label').contains('Current Password').click().type(userData.password);
    userData.password = "Qa1234567"
    cy.get('label').contains('New Password').click().type(userData.password);
    cy.get('label').contains('Confirm New Password').click().type(userData.password);
    cy.get(locators.ChangePasswordButton).click();
    cy.get('span').contains('successfully');
}

function openAddressBooksPage() {
    WebClientOpenActionMenuItem('Address Book')
    cy.get('div').contains('Address Book').should('be.visible');
}

function openUpdateProfilePage()
{
    WebClientOpenActionMenuItem('Update Profile')
    cy.get('div').contains('Update Profile').should('be.visible');
}

function WebClientlogout() {
    cy.get(locators.AccountLink).click();
    cy.get(locators.AccountMenu).should('be.visible');
    cy.get(locators.LogoutButton).click();
}

export default {
    WebClientOpenActionMenuItem,
    WebClientChangePassword,
    openAddressBooksPage,
    openUpdateProfilePage,
    WebClientlogout,
}
