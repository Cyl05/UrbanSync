describe('Create Issue via Address Search', () => {
    const citizenEmail = 'citizen@test.com';
    const citizenPassword = 'password123';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.getByTestId('login-button').click();
        cy.getByTestId('email-input').type(citizenEmail);
        cy.getByTestId('password-input').type(citizenPassword);
        cy.getByTestId('submit-button').click();
        cy.url().should('not.include', '/login');
    });

    it('should create an issue using address search', () => {
        cy.getByTestId('new-issue-button').click();
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('address-search').should('be.visible');
        cy.getByTestId('address-search').find('input').type('Bangalore');

        cy.get('.geoapify-autocomplete-items').find('.geoapify-autocomplete-item').first().click();

        cy.get('.leaflet-marker-pane').find('img').should('exist');

        cy.getByTestId('issue-title').type('Pothole on Main Street');
        cy.getByTestId('issue-description').type('Large pothole near the intersection.');
        cy.getByTestId('issue-type').select('roads_pavements');
        cy.getByTestId('issue-photo-url').type('https://cdn.shopify.com/s/files/1/0274/7288/7913/files/MicrosoftTeams-image_32.jpg?v=1705315718');

        cy.getByTestId('submit-issue').click();

        cy.getByTestId('close-sidebar').click();
        cy.getByTestId('profile-button').click();

        cy.reload();

        cy.contains('Pothole on Main Street').should('be.visible');
    });
});
