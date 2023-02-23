import addOns from "../../../support/pages/addons/addonsPage";
import projectsPage from "../../../support/pages/projects/projectsPage";

describe('test suite is implemented to test Write EDI X12 task', () => {
    before('login to mft Admin UI', () => {
        cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
    });

    it('test case is implemented to read data from xml file, convert to EDI X12 and verify the results are correct', () => {
        const filePath = '/EDI/Write EDI X12 from XML.xml';
        const variables = [
            {
                name: "filePath",
                value: `${Cypress.env('projectPath')}\\cypress\\fixtures\\EDI`
            }
        ];
        const addOnName = '850 Purchase Order - 4010';

        addOns.openAddOnsPage();
        addOns.installAddOnFromMarketPlace('EDI X12 Transaction Set', addOnName);
        addOns.getAddOnUUID(addOnName).then((uuid) => {
            const addon_uuid = uuid.rows[0].addon_uuid;
            addOns.updateEDIDefinition(`cypress/fixtures${filePath}`, addon_uuid);
        });
        projectsPage.openProjectsPage();
        projectsPage.importProject(filePath, 'XML');
        cy.getProjectNameFromXML(`cypress/fixtures${filePath}`).then((projectName) => {
            projectsPage.projectExecuteAdvanced(projectName, variables);
        });

    });
});