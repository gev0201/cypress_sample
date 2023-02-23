import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserAddressBooks from '/cypress/support/pages/webUsers/webUserAddressBooksPage.js';
import MyProfile from '/cypress/support/pages/webClient/myProfile.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to test web user address books functionality', () => {
    let userData;
    before(() => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.PasswordPolicy;
            delete userData.ProfileSettings;
            userData.Features = ["HTTPS"];
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
            webUserAddressBooks.openWebUserAddressBooksPage();
            webUserAddressBooks.addAddressBook(userData);
            cy.getInstallDirectory().then((dir) => {
                cy.wrap(dir.text()).as('dir');
            });
        });
    });

    it('test case is implemented to verify the web user is created with shared address book', () => {
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        cy.selectMoreAction(userData.username, "View");
        cy.contains(userData.AddressBooks.name[0]).scrollIntoView().should('be.visible');
    });

    it('test case is implemented to verify that address book appears in client side', () => {
        cy.loginClient(userData.username, userData.password, false);
        MyProfile.openAddressBooksPage();
        cy.get('#bookSelector_label').should('be.visible').click();
        cy.get('tr>td').contains(userData.AddressBooks.name[0]).should('be.visible');
    });


    after('remove web user address book', () => {
        webUserCommands.deleteWebUser(userData.username);
        cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
        webUserAddressBooks.openWebUserAddressBooksPage();
        webUserAddressBooks.deleteAddressBook(userData);
    })
});