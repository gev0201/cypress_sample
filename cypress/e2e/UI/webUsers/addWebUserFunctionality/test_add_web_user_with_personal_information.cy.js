import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import MyProfile from '/cypress/support/pages/webClient/myProfile.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js'
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage.js";
import { services } from "../../../../fixtures/Services/serviceNames.js";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to check add web user with personal information functionality', () => {
    let userData;
    beforeEach('prepare data, login to admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
            userData.Features = ["HTTPS"];
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
        })
    });

    it('test case is implemented to verify the web user is created with personal information and check it on client side', () => {
        userData.GeneralFields.firstName = "Test first name";
        userData.GeneralFields.lastName = "Test last name";
        userData.GeneralFields.organization = "Test organization name";
        userData.GeneralFields.phone = "+1111111111";
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        }).then(() => {
            cy.loginClient(userData.username, userData.password);
            MyProfile.openUpdateProfilePage();
            Object.keys(userData.GeneralFields).forEach(key => {
                cy.get('input[value="' + `${userData.GeneralFields[key]}` + '"]').should('be.visible');
            });
        });
    });

    it('test case is implemented to verify the web user is created with personal information and check it when viewing the user', () => {
        userData.GeneralFields.email = "test@hs.com";
        userData.GeneralFields.mphone = "1111111111";
        userData.Features = ['HTTPS'];
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        }).then(() => {
            cy.selectMoreAction(userData.username, "View");
            cy.contains(userData.GeneralFields.email).scrollIntoView().should('be.visible');
            cy.contains(userData.GeneralFields.mphone).scrollIntoView().should('be.visible');
        });
    });

    afterEach('remove web user', () => {
        webUserCommands.deleteWebUser(userData.username);
    });

});