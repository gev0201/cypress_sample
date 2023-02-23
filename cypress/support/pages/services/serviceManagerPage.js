import menu from "../../../fixtures/Menu/Menu";
import servicesCommands from "../../API/servicesCommands";
import {services} from "../../../fixtures/Services/serviceNames";


function openServiceManagerPage() {
    cy.navigateToThePageByName(menu.menuItems.services.locator, menu.submenuItems.service_manager);
    cy.verifyPageTitle(menu.submenuItems.service_manager);
}

function startGivenService(serviceName) {
    openServiceManagerPage();
    cy.startService(serviceName);

}


export default {
    openServiceManagerPage,
    startGivenService,
}