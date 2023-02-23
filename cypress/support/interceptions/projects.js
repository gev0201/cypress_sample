const browseProjects = () => {
    cy.intercept({
        method: 'POST',
        url: '/goanywhere/pd/BrowseProjects.xhtml'
    }).as('browseProjects');
};

const executeProjectForm = () => {
    cy.intercept({
        method: 'POST',
        url: '/goanywhere/pd/ExecuteProjectForm.xhtml'
    }).as('executeProjectForm');
};

 const importProject = () => {
    cy.intercept({
        method: 'POST',
        url: '/goanywhere/pd/ImportProject.xhtml'
    }).as('importProject');
};

 export  {
     browseProjects,
     executeProjectForm,
     importProject
 }