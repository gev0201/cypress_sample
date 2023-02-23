import menu from '/cypress/fixtures/Menu/Menu.js';
import {locators} from './webUsersPage';
import * as interceptions from '../../interceptions/webUsers';

const settingsLocators = {
    requiredInput: '[id$="Required_input"]',
    updateInput: '[id$="Update_input"]',
    selfRegistrationInput: '[id$="Prompt_input"]',
    uniqueEmailAddress: '[id$="emailReuse_input"]',
    enableAnonymousWebUser: '[id$="allowAnonymousLogins_input"]',
    passwordValidationLabel: '[id$="passwordValidation_label"]',
    enforceSettingsCheckbox: '[id$=":passwordPolicy:strengthEnforced"]'
}


function openWebUserSettingsPage() {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.web_user_settings);
    cy.verifyPageTitle(menu.submenuItems.web_user_settings);
}

function changeWebUserPasswordPolicy(policy) {
    cy.get('li > a').contains('Password Policy').should('be.visible', '{force: true}').click();
    cy.get('[id$=":passwordPolicy:strengthEnforced"]').then(($checkbox) => {
        if (!$checkbox.find('.ui-chkbox-box.ui-state-active').length) {
            cy.get($checkbox).click();
        }
    });
    policy.forEach((policy) => {
        cy.get('label').contains(policy.name).should('be.visible').click().type('{selectAll}' + policy.value)
    });
    cy.get(locators.saveButton).click();
}

function changeWebUserProfileSettings(profileSettings) {
    interceptions.webUserSettingsPage();
    const settings = Object.keys(profileSettings);
    cy.get('li > a').contains('Profile').should('be.visible').click();
    cy.get('[id$=":profileFields:firstLastNameRequired"]').then(() => {
        settings.forEach((setting) => {
            const isRequiredElem = `[id$="${setting}Required_input"]`;
            const profileUpdateElem = `[id$="${setting}Update_input"]`;
            const selfRegistrationElem = `[id$="${setting}Prompt_input"]`;
            cy.get(isRequiredElem).then((checkbox) => {
                if (checkbox.attr('aria-checked') === 'false') {
                    if (profileSettings[setting].isRequired) {
                        cy.get(checkbox).check({force: true}).wait(500).then((el) => {
                            cy.wait('@webUserSettingsPage').its('response.statusCode').should('equal', 200).then(() => {
                                expect(el.attr('aria-checked')).to.be.eq('true');
                            });
                        });
                    }
                } else if (checkbox.attr('aria-checked') === 'true') {
                    if (!profileSettings[setting].isRequired) {
                        cy.wrap(checkbox).uncheck({force: true}).wait(500).then((el) => {
                            cy.wait('@webUserSettingsPage').its('response.statusCode').should('equal', 200).then(() => {
                                expect(el.attr('aria-checked')).to.be.eq('false');
                            });
                        });
                    }
                }
            });
        });
    });
    cy.get(locators.saveButton).then((button) => {
        if (button.is(":enabled")) {
            button.click();
            cy.wait('@webUserSettingsPage').its('response.statusCode').should('equal', 200);
            cy.verifySuccessMessages([`Web User Security Settings were updated successfully`]);
        }
    })


}

export default {
    openWebUserSettingsPage,
    changeWebUserPasswordPolicy,
    changeWebUserProfileSettings,
}
