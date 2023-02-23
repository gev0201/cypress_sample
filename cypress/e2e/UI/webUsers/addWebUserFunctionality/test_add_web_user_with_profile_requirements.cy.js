import webUserSettings from '/cypress/support/pages/webUsers/webUserSettingsPage.js';
import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to test add web user with profile requirements functionality', () => {
    let userData;
    beforeEach('prepare data, login to Admin UI', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.PasswordPolicy;
            delete userData.AddressBooks;
            userData.Features = ["HTTPS"];
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
            webUserSettings.openWebUserSettingsPage();
        });
    });

    it('test case is implemented to verify the web user is not created when first and last names are required, but not specified', () => {
        userData.profileSettings.firstLastName.isRequired = true
        let errorMessage = 'First Name: Value is required.Last Name: Value is required.';
        webUserSettings.changeWebUserProfileSettings(userData.profileSettings);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });

    it('test case is implemented to verify the web user is not created when organization is required, but not specified', () => {
        userData.profileSettings.organization.isRequired = true;
        let errorMessage = 'Organization: Value is required.';
        webUserSettings.changeWebUserProfileSettings(userData.profileSettings);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });

    it('test case is implemented to verify the web user is not created when phone is required, but not specified', () => {
        userData.profileSettings.phone.isRequired = true;
        let errorMessage = 'Office Phone: Value is required.';
        webUserSettings.changeWebUserProfileSettings(userData.profileSettings);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });

    it('test case is implemented to verify the web user is not created when email is required, but not specified', () => {
        userData.profileSettings.email.isRequired = true;
        let errorMessage = 'Email Address: Value is required.';
        webUserSettings.changeWebUserProfileSettings(userData.profileSettings);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });

    after('Reset Web User profile settings to the defaults', () => {
        cy.visit('/goanywhere');
        Object.keys(userData.profileSettings).forEach((setting) => {
            userData.profileSettings[setting].isRequired = false;
        });
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserProfileSettings(userData.profileSettings);
    });
});