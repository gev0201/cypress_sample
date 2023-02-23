import webUserSelfRegistrationPage from '/cypress/support/pages/webUsers/webUserSelfRegistrationPage.js';
import loginPage from '/cypress/support/pages/webClient/loginPage.js';
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is designed to test Web User Self-Registration functionality', () => {
    let userData;
    before('prepare data, login to Admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.PasswordPolicy;
            delete userData.AddressBooks;
            delete userData.profileSettings;
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
        });

    });

    it('test case is designed to check the web user can register when self-registration is enabled', () => {
        userData.Features = ['HTTPS'];
        webUserSelfRegistrationPage.openWebUserSelfRegistrationPage();
        webUserSelfRegistrationPage.enableWebUserSelfRegistration();
        cy.loginClient(userData.username, userData.password, false)
        let errorMessage = 'The value you have entered does not match the image, please try again.';
        loginPage.VerifyCreateAccount();
        cy.get('[id $= "emailAddress"]').should('be.visible').type('test_self_registration@hs.com');
        cy.get('[id $= "captchaInput"]').should('be.visible').type('test');
        cy.get('span').contains('Next').should('be.visible').click();
        cy.verifyErrorMessage(errorMessage);
    });
});