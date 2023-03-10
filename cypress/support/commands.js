// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload';
import help from "./pages/help/help";
import 'cypress-iframe';
const xml2js = require('xml2js');
import * as interceptions from './interceptions/services';

Cypress.Commands.add('login', (username, password) => {
    cy.clearCookies();
    cy.visit('/goanywhere');
    cy.get('[id="formPanel:loginGrid:name"]').clear().type(username);
    cy.get('[id="formPanel:loginGrid:value"]').clear().type(password);
    cy.get('button[id^="formPanel:loginGrid"]').click().then(() => {
        cy.get('h4').contains('GoAnywhere').should('be.visible');
    });
});

Cypress.Commands.add('loginClient', (username, password, checkSuccessMessage = true) => {
    const webClientUrl = `https://${Cypress.env('host')}:${Cypress.env('webUserPort')}/`;
    const args = {username, password, checkSuccessMessage, webClientUrl};
    cy.origin(webClientUrl, {args}, ({username, password, checkSuccessMessage, webClientUrl}) => {
        Cypress.on('uncaught:exception', () => false);
        cy.visit(webClientUrl);
        cy.get('[id = "username"]').clear().type(username);
        cy.get('[id = "value"]').clear().type(password);
        cy.get('span').contains('Login').click().then(() => {
            if (checkSuccessMessage) {
                cy.get('[id = imageLink]').should('be.visible');
            }
        });
    });
});

Cypress.Commands.add('verifyPageTitle', (title) => {
    cy.get('.headingToolbarInner').within(() => {
        cy.get('h1').should('be.visible').and('have.text', title);
    });

})

Cypress.Commands.add('verifySuccessMessage', (messageText) => {
    cy.get('.ui-messages-info-summary')
        .should('be.visible')
        .and('have.text', messageText)
});

Cypress.Commands.add('verifySuccessMessages', (messageTexts) => {
    cy.get('#messages .ui-messages-info-summary').each((message, i) => {
        expect(message).to.be.visible;
        expect(message.text()).to.be.eq(messageTexts[i])
    });
});

Cypress.Commands.add('getWebUserAutoGeneratedPassword', () => {
    cy.get('#messages .ui-messages-info-summary').contains('Password was set to').then((message) => {
        cy.wrap(message.text().split(':').pop().trim()).as('password');
    });
});

Cypress.Commands.add('verifyNoErrors', () => {
    cy.get('.ui-messages-error').should('not.exist');
});

Cypress.Commands.add('verifyErrorMessage', (messageText, locator = '#messages .ui-messages-error-summary') => {
    cy.get(locator)
        .should('be.visible')
        .and('have.text', messageText);
})

Cypress.Commands.add('logout', () => {
    cy.get('[aria-label="account"]').click().then(() => {
        cy.get('span').contains('Log Out').click({force: true})
    });
});

Cypress.Commands.add('projectExecuteAdvanced', (projectName) => {
    cy.get('.ui-datatable-selectable').contains(projectName).within(() => {
        cy.get('.MoreActions a').click().then(() => {
            cy.get('span').contains('Execute Advanced').click();
            cy.verifyPageTitle('Execute Project');
        });
    });
});

Cypress.Commands.add('getProjectNameFromXML', (filePath) => {
    cy.readFile(filePath).then((xml) => {
        cy.wrap(Cypress.$(xml))
            .then(xml => xml.filter('project').attr('name')).then((name) => {
            cy.wrap(name).as('projectName');
        });
    });
});

Cypress.Commands.add('getResourceNameFromXML', (filePath) => {
    cy.readFile(filePath).then((xml) => {
        cy.wrap(Cypress.$(xml))
            .then(xml => xml.filter('resource').find('resourceName').text()).then((name) => {
            cy.wrap(name).as('resourceName');
        });
    });
});

Cypress.Commands.add('parseXmlToJson', (filepath) => {
    cy.readFile(filepath).then((xml) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                throw err
            } else {
                return cy.wrap(result);
            }
        });
    });
});

Cypress.Commands.add('parseJsonToXml', (filepath, data) => {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(data);
    cy.writeFile(filepath, xml);
});

Cypress.Commands.add('selectMoreAction', (item, action) => {
    cy.get('.Data').each(($el) => {
        if ($el.text() === item) {
            cy.get($el).parents('tr').children('.MoreActions').click();
            cy.get('span.ui-menuitem-text').should('be.visible').contains(action).click();
        }
    })
});

Cypress.Commands.add('getInstallDirectory', () => {
    help.openHelpAboutPage();
    help.viewSystemInfo();
    cy.get('label').contains('Installation Directory').parent('td').next('td').within(() => {
        cy.get('span[id^="AboutForm:"]').invoke('text').then((text) => {
            cy.wrap(text).as('installDirectory');

        });
    });
});

Cypress.Commands.add('uploadFile', (fileName, fileType) => {
    cy.fixture(fileName).then(fileContent => {
        cy.get('input[type="file"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: fileName,
            mimeType: fileType
        });
    });
});

Cypress.Commands.add('navigateToThePageByName', (menuLocator, submenuTitle) => {
    const submenuItems = '[data-menu-depth="2"]';
    cy.get(menuLocator).within((menuItem) => {
        if (!menuItem.find('.MuiCollapse-container.MuiCollapse-entered').length) {
            cy.get('[data-menu-depth="1"]').scrollIntoView().should('be.visible').click();
        }
        cy.get(submenuItems).contains(submenuTitle).click();
    });
});

Cypress.Commands.add('startService', (serviceName) => {
    interceptions.listServices();
    const message = [`Service '${serviceName}' was started successfully`];
    cy.get('.Data').contains(serviceName).parent('tr').then((service) => {
        cy.get(service.find('.MoreActions')).click().then(() => {
            cy.wait(['@listServices', '@listServices']).each((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            });
            cy.get('.ui-menuitem-link').contains('Start').click().then(() => {
                cy.verifySuccessMessages(message);
            });
        });
    });
});

Cypress.Commands.add('getAdminUserLinks', () => {
    let links = [];
    cy.get('[data-menu-depth="1"], [data-menu-depth="2"], [data-menu-depth="3"]').each(($item) => {
        if ($item.attr('href')) {
            links.push($item.attr('href'));
        }
    }).then(() => {
        cy.wrap(links).as('links');
    });
});