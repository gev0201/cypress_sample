import menu from '/cypress/fixtures/Menu/Menu.js'

function openHomePage() {
    cy.get('span').contains(menu.menuItems.home).scrollIntoView().should('be.visible').click().then(() => {
        cy.verifyPageTitle('My Dashboard');
    });
}

export default {
    openHomePage,
}