import menu from '/cypress/fixtures/Menu/Menu.js';
import resourceTypes from '/cypress/fixtures/Resources/resourceTypes.js';

const locators = {
    importResourceFromButton: '[id$=":toolBarMenuList1_menu"] a',
    fileInputField: 'input[type="file"]',
    importResourceButton: '[id$=":btnImport"]'
}

function openResourceByGivenType(resourceType) {
    cy.get('span').contains(menu.menuItems.resources.name).click();
    cy.get('a').contains(resourceTypes.types[`${resourceType}`]).click().then(() => {
        cy.verifyPageTitle(resourceTypes.types[`${resourceType}`]);
    });
}

function importResource(filePath, resourceType, fileType) {
    cy.get('span').contains('Import Resources').click().then(()=> {
        cy.get(locators.importResourceFromButton).contains(`Import from ${fileType}`)
            .should('be.visible').click().then(() => {
            cy.verifyPageTitle(`Import Resource from ${fileType}`);
        });
        cy.get(locators.fileInputField).attachFile(filePath);
        cy.get(locators.importResourceButton).click().then(() => {
            cy.getResourceNameFromXML(`cypress/fixtures/${filePath}`).then((resourceName) => {
                cy.verifySuccessMessage(`Resource '${resourceName}' of type '${resourceType}' was successfully imported`);
            });

            cy.verifyNoErrors();
        })
    })
}

export default {
    openResourceByGivenType,
    importResource,
}