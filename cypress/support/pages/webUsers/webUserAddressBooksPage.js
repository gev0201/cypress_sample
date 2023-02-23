import menu from '/cypress/fixtures/Menu/Menu.js';

const addressBooksLocators = {
    bookName: '[id$="bookName"]'
}

function openWebUserAddressBooksPage() {
    cy.navigateToThePageByName(menu.menuItems.users.locator, menu.submenuItems.web_user_address_books);
    cy.verifyPageTitle(menu.submenuItems.web_user_address_books);
}

function addAddressBook(userData) {
    userData.AddressBooks.name.forEach((book) => {
        cy.get('span').contains('Add Address Book').click();
        cy.get(addressBooksLocators.bookName).type(book);
        cy.get('button').contains('Save').click();
    })
}

function deleteAddressBook(userData) {
    userData.AddressBooks.name.forEach((book) => {
        cy.selectMoreAction(book, 'Delete');
        cy.get('div').contains('Are you sure you want to delete the selected address book?').should('be.visible');
        cy.get('button').contains('Confirm').should('be.visible').click();
        cy.verifySuccessMessages([`Address book '` + book + `' was deleted.`]);
    })
}

export default {
    openWebUserAddressBooksPage,
    addAddressBook,
    deleteAddressBook,
}