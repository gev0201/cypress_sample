import menu from "../../../fixtures/Menu/Menu";

const locators = {
    addSelectedItemsButton: 'button[title="Add"]',
    userNameInput: '[id="AddUserForm:addUserPanel:addUserGrid:name"]',
    userPasswordInput: '[id="AddUserForm:addUserPanel:addUserGrid:passwordValue1"]',
    userConfirmPasswordInput: '[id="AddUserForm:addUserPanel:addUserGrid:passwordValue2"]',
    userRolesGrid: '[id="AddUserForm:addUserPanel:addUserGrid:userRoles"]',
    userGroupsGrid: '[id="AddUserForm:addUserPanel:addUserGrid:userGroups"]',
    userDomainsGrid: '[id="AddUserForm:addUserPanel:addUserGrid:userDomains"]',
    adminUserSaveButton: '[id="AddUserForm:saveBtn"]',
    menuItems: '#react-navbar [data-menu-depth="1"]',
    submenuItems: '[data-menu-depth="2"]'
}

const constants = {
    users: 'Users',
    adminUsers: 'Admin Users',
    addAdminUser: 'Add Admin User'
}

function openAdminUsersPage()  {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.admin_users);
    cy.verifyPageTitle(menu.submenuItems.admin_users);
}

function addNewAdminUser(userData) {
    cy.get('span').contains(constants.addAdminUser).click();
    cy.get(locators.userNameInput).type(userData.username)
    cy.get(locators.userPasswordInput).type(userData.password)
    cy.get(locators.userConfirmPasswordInput).type(userData.password)
    userData.roles.forEach((role) => {
        cy.get(`[data-item-label="${role}"]`).click({shiftKey: true});
    })
    cy.get(locators.userRolesGrid).within(() => {
        cy.get(locators.addSelectedItemsButton).click().then(() => {
            userData.roles.forEach((role) => {
                cy.get('ul[aria-label="Selected"] li').contains(role).should('exist');
            })
        })
    })
    if(userData.groups.length > 0) {
        userData.groups.forEach((group) => {
            cy.get(`[data-item-label="${group}"]`).click({shiftKey: true});
        })
        cy.get(locators.userGroupsGrid).within(() => {
            cy.get(locators.addSelectedItemsButton).click().then(() => {
                userData.groups.forEach((group) => {
                    cy.get('ul[aria-label="Selected"] li').contains(group).should('exist');
                })
            })
        })
    }
    userData.domains.forEach((domain) => {
        cy.get(`[data-item-label="${domain}"]`).click({shiftKey: true});
    })
    cy.get(locators.userDomainsGrid).within(() => {
        cy.get(locators.addSelectedItemsButton).click().then(() => {
            userData.domains.forEach((domain) => {
                cy.get('ul[aria-label="Selected"] li').contains(domain).should('exist');
            })
        })
    })
    cy.get(locators.adminUserSaveButton).click().then(() => {
        cy.verifySuccessMessage(`User '${userData.username}' was added successfully`)
    })

}

function verifyAdminUserPermissionsByRole(role) {
    let object = {}
        cy.get(locators.menuItems).each((menuItem) => {
            if(!menuItem.parent('div').find(locators.submenuItems).length){
                object[`${menuItem.text()}`] = []
            } else {
                cy.get(menuItem).parent('div').find(locators.submenuItems).then(($els) => {
                    object[`${menuItem.text()}`] = Cypress._.map(Cypress.$.makeArray($els), 'textContent');
                })

            }
        }).then(() => {
            cy.fixture('AdminUserPermissions/Permissions').then((permissions) => {
                expect(object).to.deep.equal(permissions[role])
            });
        });
}

function verifyNoPermissionLinksAreUnavailable(links) {
    let errorMessage = 'You do not have sufficient authority to access this page. Please login with a different user name.';
    cy.getAdminUserLinks().then((userLinks) => {
        links.forEach((link) => {
            if(!userLinks.includes(link)) {
                cy.visit(link);
                cy.verifyErrorMessage(errorMessage, '.ui-messages-error-summary')
            }
        })
    });
}

export default {
    openAdminUsersPage,
    addNewAdminUser,
    verifyAdminUserPermissionsByRole,
    verifyNoPermissionLinksAreUnavailable
}
