const locators = {
    CurrentPassword: "[id = 'loginForm\\:currentValue']",
    NewPassword: "[id = 'loginForm\\:newValue']",
    ConfirmNewPassword: "[id = 'loginForm\\:confirmNewValue']"
}

function ForcePasswordChange(userData) {
    cy.get(locators.CurrentPassword).should('be.visible').click().type(userData.password);
    userData.password = userData.password + Cypress._.random(0, 1e6);
    cy.get(locators.NewPassword).should('be.visible').click().type(userData.password);
    cy.get(locators.ConfirmNewPassword).should('be.visible').click().type(userData.password);
    cy.get('span').contains('Change Password').should('be.visible').click();
}

function VerifyCreateAccount() {
    cy.get('a').contains('Create Account').should('be.visible').click();
    cy.verifyPageTitle('Register - Enter Email');
}

export default {
    ForcePasswordChange,
    VerifyCreateAccount,
}