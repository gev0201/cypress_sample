import menu from '/cypress/fixtures/Menu/Menu.js'
import { locators } from './webUsersPage'

function openWebUserGroupsPage() {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.web_user_groups);
    cy.verifyPageTitle(menu.submenuItems.web_user_groups);
}

function addWebUserGroup(groupData, autoGeneratedName = true) {
    cy.get('span').contains('Add Web User Group').click();

    if (autoGeneratedName) {
        groupData.groupname = "Random_Group_" + Cypress._.random(0, 1e6);
    }
    cy.get(locators.nameInput).type(groupData.groupname)

    if (groupData.Features) {
        groupData.Features.forEach((feature) => {
            cy.get('[id = "generalPanel"]').contains(feature).click({ shiftKey: true });
        })
    }

    if (groupData.GeneralFolders) {
        cy.get('li > a').contains('Folders').click()
        if (groupData.GeneralFolders == "All") {
            cy.get(locators.userSelectAllFolderPermissions).click();
        } else {
            groupData.GeneralFolders.forEach((folder) => {
                cy.get(locators.userGeneralFolders).contains(folder).click({ shiftKey: true });
                cy.get('.ui-messages-info-icon').should('be.visible')
            })
        }
    }

    cy.get(locators.saveButton).click();
}

function deleteWebUserGroup(userData) {
    userData.UserGroups.forEach((group) => {
        cy.selectMoreAction(group, 'Delete');
        cy.get('div').contains('Are you sure you want to delete the selected web user group(s)?').should('be.visible');
        cy.get('button').contains('Confirm').should('be.visible').click();
        cy.verifySuccessMessages([`1 web user group(s) deleted`]);
    })
}
export default {
    openWebUserGroupsPage,
    addWebUserGroup,
    deleteWebUserGroup,
}