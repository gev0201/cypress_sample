import webUserSettings from '/cypress/support/pages/webUsers/webUserSettingsPage.js';
import webUsers from '/cypress/support/pages/webUsers/webUsersPage.js';
import webUserCommands from '/cypress/support/API/webUserCommands.js';
import serviceManagerPage from "../../../../support/pages/services/serviceManagerPage";
import {services} from "../../../../fixtures/Services/serviceNames";
import servicesCommands from "../../../../support/API/servicesCommands";

describe('test suite is implemented to test Web User Enforce Password Policy functionality', () => {
    let userData, policy;
    before('prepare data', () => {
        cy.fixture('WebUsers/allPermission').then(fixtureData => userData = fixtureData).then(() => {
            delete userData.GeneralFields;
            delete userData.IpFilter;
            delete userData.UserGroups;
            delete userData.VirtualFolder;
            delete userData.AddressBooks;
            delete userData.ProfileSettings;
            delete userData.Features;
            delete userData.GeneralFolders;
        });

    });

    beforeEach('login to admin UI, set default settings for password policy', () => {
        cy.fixture('WebUsers/defaultPasswordPolicy').then(fixtureData => policy = fixtureData.passwordPolicy).then(() => {
            servicesCommands.getServiceStatusThroughAPI(services.https.name).then((response) => {
                cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
                if (response.body.data[0].status === "STOPPED") {
                    serviceManagerPage.openServiceManagerPage();
                    cy.startService(services.https.name);
                }
            });
            webUserSettings.openWebUserSettingsPage();
            webUserSettings.changeWebUserPasswordPolicy(policy);
        });

    });

    it('test case is implemented to verify the web user is created according to minimum password length policy', () => {
        policy.forEach((entry) => {
            if (entry.name === "Minimum Password Length") {
                entry.value = "4"
            }
        });
        userData.password = "Min1";
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserPasswordPolicy(policy);
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        webUserCommands.deleteWebUser(userData.username);
    });

    it('test case is implemented to verify the web user is created according to minimum count of lower case letters policy', () => {
        userData.password = "WITHOUTLC1"
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        webUserCommands.deleteWebUser(userData.username);
    });

    it('test case is implemented to verify the web user is created according to minimum count of upper case letters policy', () => {
        policy.forEach((entry) => {
            if (entry.name === "Minimum Number of Upper Case Letters") {
                entry.value = "0"
            }
        });
        userData.password = "withoutuc1"
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserPasswordPolicy(policy);
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        webUserCommands.deleteWebUser(userData.username);
    });

    it('test case is implemented to verify the web user is created according to minimum count of digits policy', () => {
        policy.forEach((entry) => {
            if (entry.name === "Minimum Number of Digits") {
                entry.value = "0"
            }
        });
        userData.password = "Withoutdigits"
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserPasswordPolicy(policy);
        cy.getInstallDirectory().then((dir) => {
            cy.wrap(dir.text()).as('dir');
        });
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.get('@dir').then((dir) => {
            webUsers.verifyWebUserCreated(userData, dir);
        });
        webUserCommands.deleteWebUser(userData.username);
    });

    it('test case is implemented to verify the web user is not created if the password does not match to minimum number pf special characters policy', () => {
        policy.forEach((entry) => {
            if (entry.name === "Minimum Number of Special Characters") {
                entry.value = "1"
            }
        });
        userData.password = "Withoutcharacters";
        let errorMessage = `Password does not conform to policy. The current policy requirements are:Must be at least 8 character(s) longMust have at least 1 upper case letter(s)Must have at least 1 digit(s)Must have at least 1 special character(s)The only special characters allowed are ~@#$%^&*()-_=+<>?/\\;:[]{},.`
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserPasswordPolicy(policy);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });

    it('test case implemented to verify the web user is not created with not allowed special characters', () => {
        policy.forEach((entry) => {
            if (entry.name === "Allowable Special Characters") {
                entry.value = " "
            }
        });
        userData.password = "User_Pass";
        let errorMessage = `Password does not conform to policy. The current policy requirements are:Must be at least 8 character(s) longMust have at least 1 upper case letter(s)Must have at least 1 digit(s)`
        webUserSettings.openWebUserSettingsPage();
        webUserSettings.changeWebUserPasswordPolicy(policy);
        webUsers.openWebUsersPage();
        webUsers.addNewWebUser(userData);
        cy.verifyErrorMessage(errorMessage);
    });
});