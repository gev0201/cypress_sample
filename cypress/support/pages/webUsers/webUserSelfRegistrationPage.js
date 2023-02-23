import menu from '/cypress/fixtures/Menu/Menu.js';
import { locators } from './webUsersPage';

const selfRegistrationLocators = {
    enableSelfRegistration: '[id$="selfRegistration_input"]'
}

function openWebUserSelfRegistrationPage() {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.web_user_self_registration);
    cy.verifyPageTitle(menu.submenuItems.web_user_self_registration);
}

function enableWebUserSelfRegistration() {
    cy.get(selfRegistrationLocators.enableSelfRegistration).should('not.be.visible').check({ force: true }).should('be.checked');
    cy.get(locators.saveButton).then((button) => {
        if (button.is(":enabled")) {
            cy.get(locators.saveButton).should('be.visible').click();
            cy.verifySuccessMessages([`Updated the Web User Self-Registration preferences successfully.`]);
        }
    })
}

export default {
    openWebUserSelfRegistrationPage,
    enableWebUserSelfRegistration,
}