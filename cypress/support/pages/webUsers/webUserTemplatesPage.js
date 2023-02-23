import menu from '/cypress/fixtures/Menu/Menu.js'
import {locators} from './webUsersPage'

function openWebUserTemplatesPage() {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.web_user_templates);
    cy.verifyPageTitle(menu.submenuItems.web_user_templates);
}

function addWebUserTemplate(userData) {
    cy.get('span').contains('Add Web User Template').click();
    cy.get(locators.nameInput).type(userData.template)

    cy.get('li > a').contains('Authentication').click()
    if (userData.password == 'auto') {
        cy.get('td').contains('Generate a password').click()
    } else {
        cy.get('td').contains('Specify the password').click()
    }

    if (userData.AuthenticationAlias) {
        cy.get(locators.AuthenticationAlias).click().type(userData.AuthenticationAlias);
    }

    if (userData.Features) {
        cy.get('li > a').contains('Features').click()
        userData.Features.forEach((feature) => {
            cy.get(locators.userFeatures).contains(feature).click({shiftKey: true});
        })
    }

    if (userData.GeneralFolders) {
        cy.get('li > a').contains('Folders').click()
        if (userData.GeneralFolders == "All") {
            cy.get(locators.userSelectAllFolderPermissions).click();
        } else {
            userData.GeneralFolders.forEach((folder) => {
                cy.get(locators.userGeneralFolders).contains(folder).click({shiftKey: true});
                cy.get('.ui-messages-info-icon').should('be.visible')
            })
        }
    }

    if (userData.TimeLimits) {
        const TodaysDate = require('dayjs')
        cy.get('li > a').contains('Time Limits').click()
        cy.get(locators.webUserExpiresOnInput).click().type(TodaysDate().add(userData.TimeLimits[0], 'day').format('MMM DD, YYYY'));
    }

    cy.get(locators.saveButton).click();
}

function deleteWebUserTemplate(userData) {
    cy.selectMoreAction(userData.template, 'Delete');
    cy.get('div').contains('Are you sure you want to delete the selected web user template?').should('be.visible');
    cy.get('button').contains('Confirm').should('be.visible').click();
    cy.verifySuccessMessages([`Web user template '` + userData.template + `' was deleted successfully`]);
}

export default {
    openWebUserTemplatesPage,
    addWebUserTemplate,
    deleteWebUserTemplate,
}