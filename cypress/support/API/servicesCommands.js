const endpoint = `${Cypress.env('apiEndpoint')}services/status`;

function getServiceStatusThroughAPI(serviceName, adminUser = Cypress.env('adminUserName'), adminPassword = Cypress.env('adminPassword')){
    let identifier;
    switch(serviceName) {
        case 'HTTPS':
            identifier = 1;
            break;
        case 'FTP':
            identifier = 2;
            break;
        case 'FTPS':
            identifier = 4;
            break;
        case 'SFTP':
            identifier = 8;
            break;
        case 'GoFast':
            identifier = 32;
            break;
        case 'Agents':
            identifier = 64;
            break;
        case 'PeSIT':
            identifier = 512;
    }
    return cy.request({
        method: 'GET',
        url: `${endpoint}?services=${identifier}`,
        auth: {
            username: adminUser,
            password: adminPassword
        }
    });
}


export default {getServiceStatusThroughAPI}