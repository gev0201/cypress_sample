import menu from '/cypress/fixtures/Menu/Menu.js';
import * as interceptions from "../../interceptions/projects";

const locators = {
    importProjectFrom: '[id="toolBarMenuList1_menu"] a',
    fileInputField: 'input[type="file"]',
    importProjectButton: 'button[id^="ImportProjectForm:"]'
}

function openProjectsPage() {
    cy.get('span').contains(menu.menuItems.workflows.name).should('be.visible').click().then(() => {
        cy.get('span').contains(menu.submenuItems.projects).click().then(() => {
            cy.verifyPageTitle(menu.submenuItems.projects)
        });
    });
}

function importProject(filePath, type) {
    interceptions.browseProjects();
    interceptions.importProject();
    cy.get('span').contains('Import Projects').click().then(() => {
        cy.get(locators.importProjectFrom).contains(`Import From ${type}`)
            .should('be.visible').click().then(() => {
                cy.wait(['@importProject', '@importProject']).each((interception) => {
                    expect(interception.response.statusCode).to.eq(200);
                });
            cy.verifyPageTitle(`Import Project from ${type}`)
        })
        cy.get(locators.fileInputField).attachFile(filePath);
        cy.get(locators.importProjectButton).contains('Import').click().then(() => {
            cy.wait(['@browseProjects', '@browseProjects']).each((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            })
            let fileName = filePath.split('/').pop();
            cy.getProjectNameFromXML(`cypress/fixtures/${filePath}`).then((projectName) => {
                cy.verifySuccessMessage(`Project file '${fileName}' was imported successfully. The imported project name is '${projectName}'.`)
            })
            cy.verifyNoErrors();
        })
    })
}

function projectExecute(projectName) {
    cy.get('.ui-datatable-selectable').each((row, i) => {
        if (row.find('.Data a').text() === projectName) {
            cy.get('.ActionIcons a').eq(i).click().then(() => {
                cy.get('.ui-messages-info-summary')
                    .should('be.visible')
                    .and('contain.text', `${projectName}' ran successfully. Job number is '`);
                cy.get('.ui-messages-error').should('not.exist');
            })
        }

    })
}

function projectExecuteAdvanced(projectName, variables) {
    interceptions.browseProjects();
    interceptions.executeProjectForm();
    cy.get('td.Data').contains(projectName).parent('td').prev('.MoreActions').click();
    cy.wait(['@browseProjects', '@browseProjects']).each((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    }).then(() => {
        cy.get('.ui-attachpanel').should('be.visible');
        cy.get('a').contains('Execute Advanced').click();
    });
    cy.wait(['@executeProjectForm', '@executeProjectForm']).each((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    });
    cy.verifyPageTitle('Execute Project');
    variables.forEach((item, i) => {
        cy.get(`[data-ri=${i}]`).within(() => {
            cy.get('.MoreActions').next().should('have.text', item.name);
            cy.get(`[id="ExecuteProjectForm:variablesTable:${i}:value"]`).clear().type(item.value);
        });
        cy.get('button').contains('Execute').click();
        cy.wait('@executeProjectForm').its('response.statusCode').should('equal', 200);
        cy.get('.ui-messages-info-summary')
            .should('be.visible')
            .and('contain.text', `${projectName}' ran successfully. Job number is '`);
        cy.get('.ui-messages-error').should('not.exist');
    });
}

export default {
    openProjectsPage,
    importProject,
    projectExecute,
    projectExecuteAdvanced
}