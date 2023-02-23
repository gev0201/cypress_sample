import projects from '/cypress/support/pages/projects/projectsPage.js';
import resources from '/cypress/support/pages/resources/resourcesPage.js';
import workflowCommand from '/cypress/support/API/goanywhereWorkflowCommands.js'
const resourceType = 's3'

describe('test suite is designed to test amazon s3 tasks (GTC1009)', () => {
    before('should login to Admin UI', () => {
        cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
    });

    it('test case is implemented to test amazon s3 task', () => {
        resources.openResourceByGivenType(resourceType);
        resources.importResource('GTC1009/resources/GTC1009-S3.xml', resourceType, 'XML');
        projects.openProjectsPage();
        projects.importProject('GTC1009/projects/GTC1009-S3MetadataFiles.xml', 'XML');
        projects.projectExecute('GTC1009-S3MetadataFiles');

    });

    after('remove resource and project', () => {
        const body = {
            "deleteParameters" :
                {
                    "project":"/GTC1009-S3MetadataFiles",
                    "domain":"Default"
                }
        }
        workflowCommand.deleteProject(body);
        workflowCommand.deleteResource(resourceType, 'GTC1009-S3');
    });
})