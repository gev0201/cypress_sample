import menu from "../../../fixtures/Menu/Menu";
import * as interceptions from '../../interceptions/addOns';

const locators = {
    marketplaceDialog: 'div.marketplace-dialog',
    dialogTitle: '.ui-dialog-title'
}

function verifyAddOnsPageTitle() {
    cy.get('h1').contains('Add-ons').should('be.visible');
}

function selectAddOnType(addOnType) {
    cy.get('[id$="_c_panel"] .ui-selectonemenu-item').contains(addOnType).click();
}

function openAddOnsPage() {
    cy.navigateToThePageByName(menu.menuItems.system.locator, menu.submenuItems.add_ons);
    verifyAddOnsPageTitle();
}

function getAddOnUUID(addOnName) {
    const query = `SELECT addon_uuid FROM gadata.dpa_addon WHERE addon_name = '${addOnName}'`;
    return cy.task('pgDatabase', {dbConfig: Cypress.env("db"), sql: query })
}

function updateEDIDefinition(filePath, addonUUID) {
    cy.parseXmlToJson(filePath).then((result) => {
        result.project.module[0].writeX12[0].transactionSet[0].$.EDIDefinition = addonUUID;
        cy.parseJsonToXml(filePath, result);
    });
}

function installAddOnFromMarketPlace(addOnType, addOnName) {
    interceptions.listAddOns();
    cy.get('button').contains('Browse Marketplace').click();
    cy.wait('@listAddOns').its('response.statusCode').should('equal', 200);
    cy.get(locators.marketplaceDialog).within((dialog) => {
        cy.get(dialog.find(locators.dialogTitle))
            .should('be.visible')
            .and('have.text', 'Add-ons');
        cy.verifyPageTitle('Browse Marketplace');
        cy.get('.ui-selectonemenu').click();
    });
    selectAddOnType(addOnType, addOnName);
    cy.wait(['@listAddOns', '@listAddOns']).each((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    });
    cy.get('label').contains(addOnType).should('be.visible');
    cy.get('[id="searchText"]').type(`${addOnName}{enter}`);
    cy.wait('@listAddOns').its('response.statusCode').should('equal', 200);
    cy.get('[id$=":outdiv"]').contains(addOnName).should('be.visible');
    cy.get('[id$="_menuButton"]').click().then(() => {
        cy.get('.ui-splitbuttonmenu-list-wrapper').within(() => {
            cy.get('.ui-menuitem-link').contains('Install Now').click();
        });
        cy.wait('@listAddOns').its('response.statusCode').should('equal', 200);
        cy.verifySuccessMessage(`Add-on '${addOnName}' successfully installed.`);
    });

}

export default {
    openAddOnsPage,
    installAddOnFromMarketPlace,
    verifyAddOnsPageTitle,
    getAddOnUUID,
    updateEDIDefinition
}
