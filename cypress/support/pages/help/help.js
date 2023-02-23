import menu from "../../../fixtures/Menu/Menu.js";

const locators = {
    submenuItems: '[data-menu-depth="2"]'
}

function openHelpAboutPage()  {
    cy.get('#menu-mi-menuHelp').within((menuItem) => {
        if (!menuItem.find('.MuiCollapse-container.MuiCollapse-entered').length) {
            cy.get('[data-menu-depth="1"]').scrollIntoView().should('be.visible').click();
        }
        cy.get(locators.submenuItems).contains(menu.submenuItems.about).click();
    });
    cy.verifyPageTitle(menu.submenuItems.about);
}

function viewSystemInfo() {
    cy.get('a').contains('System Info').click().then((tab) => {
        cy.get(tab).parent('li')
            .should('have.attr', 'aria-expanded', 'true')
            .should('have.attr', 'aria-selected', 'true');
    });
}

export default {
    openHelpAboutPage,
    viewSystemInfo,
}