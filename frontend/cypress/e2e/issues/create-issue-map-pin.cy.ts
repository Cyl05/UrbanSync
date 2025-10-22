describe('Create Issue via Map Pin', () => {
    const citizenEmail = 'citizen@test.com';
    const citizenPassword = 'password123';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.getByTestId('login-button').click();
        cy.getByTestId('email-input').type(citizenEmail);
        cy.getByTestId('password-input').type(citizenPassword);
        cy.getByTestId('submit-button').click();
        cy.url().should('not.include', '/login');
        
        cy.wait(1000);
        cy.getByTestId('profile-button').should('be.visible');
    });

    it('should create an issue using map pin mode', () => {
        cy.getByTestId('new-issue-button').click();
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('pin-on-map-mode').click();
        cy.getByTestId('pin-on-map-mode').should('have.class', 'bg-indigo-600');

        cy.getByTestId('pin-mode-coordinates').should('be.visible');
        cy.getByTestId('latitude-display').should('be.visible');
        cy.getByTestId('longitude-display').should('be.visible');

        cy.get('.leaflet-container')
            .trigger('mousedown', { which: 1, clientX: 400, clientY: 300 })
            .trigger('mousemove', { clientX: 500, clientY: 400 })
            .trigger('mouseup', { force: true });

        cy.wait(500);

        cy.getByTestId('issue-title').type('Streetlight Not Working');
        cy.getByTestId('issue-description').type('The streetlight at the intersection has been off for three days.');
        cy.getByTestId('issue-type').select('street_lights');
        cy.getByTestId('issue-photo-url').type('https://cdn.shopify.com/s/files/1/0274/7288/7913/files/MicrosoftTeams-image_32.jpg?v=1705315718');

        cy.getByTestId('submit-issue').click();

        cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });

        cy.contains('Streetlight Not Working').should('be.visible');
        cy.contains('The streetlight at the intersection has been off for three days.').should('be.visible');
    });

    it('should switch between address search and pin mode', () => {
        cy.getByTestId('new-issue-button').click();
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('search-address-mode').should('have.class', 'bg-indigo-600');
        cy.getByTestId('address-search').should('be.visible');

        cy.getByTestId('pin-on-map-mode').click();
        cy.getByTestId('pin-on-map-mode').should('have.class', 'bg-indigo-600');
        cy.getByTestId('pin-mode-coordinates').should('be.visible');
        cy.getByTestId('address-search').should('not.exist');

        cy.getByTestId('search-address-mode').click();
        cy.getByTestId('search-address-mode').should('have.class', 'bg-indigo-600');
        cy.getByTestId('address-search').should('be.visible');
        cy.getByTestId('pin-mode-coordinates').should('not.exist');
    });

    it('should keep center marker fixed while panning', () => {
        cy.getByTestId('new-issue-button').click();
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('pin-on-map-mode').click();

        cy.getByTestId('center-marker').then(($marker) => {
            const initialPosition = $marker.position();

            cy.get('.leaflet-container')
                .trigger('mousedown', { which: 1, clientX: 400, clientY: 300 })
                .trigger('mousemove', { clientX: 500, clientY: 400 })
                .trigger('mouseup', { force: true });

            cy.wait(500);

            cy.getByTestId('center-marker').then(($newMarker) => {
                const newPosition = $newMarker.position();
                expect(newPosition.top).to.equal(initialPosition.top);
                expect(newPosition.left).to.equal(initialPosition.left);
            });
        });
    });

    it('should validate required fields in pin mode', () => {
        cy.getByTestId('new-issue-button').click();
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('pin-on-map-mode').click();

        cy.getByTestId('submit-issue').click();

        cy.url().should('match', /\/$/);
        cy.getByTestId('new-issue-sidebar').should('be.visible');

        cy.getByTestId('issue-title').type('Test Issue');
        cy.getByTestId('submit-issue').click();

        cy.url().should('match', /\/$/);
        cy.getByTestId('new-issue-sidebar').should('be.visible');
    });
});
