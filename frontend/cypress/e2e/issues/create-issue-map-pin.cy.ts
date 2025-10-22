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
        
        // Wait for authentication to complete and page to fully load
        cy.wait(1000);
        // Verify user is authenticated by checking for profile button
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

        // Fill out the issue form
        cy.getByTestId('issue-title').type('Streetlight Not Working');
        cy.getByTestId('issue-description').type('The streetlight at the intersection has been off for three days.');
        cy.getByTestId('issue-type').select('street_lights');
        cy.getByTestId('issue-photo-url').type('https://cdn.shopify.com/s/files/1/0274/7288/7913/files/MicrosoftTeams-image_32.jpg?v=1705315718');

        // Submit the issue with map pin coordinates
        cy.getByTestId('submit-issue').click();

        // Wait for navigation to issue detail page
        cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });

        // Verify issue details are displayed
        cy.contains('Streetlight Not Working').should('be.visible');
        cy.contains('The streetlight at the intersection has been off for three days.').should('be.visible');
    });

    // it('should switch between address search and pin mode', () => {
    //     // Open new issue sidebar
    //     cy.getByTestId('new-issue-button').click();
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');

    //     // Default mode is address search
    //     cy.getByTestId('search-address-mode').should('have.class', 'bg-indigo-600');
    //     cy.getByTestId('address-search').should('be.visible');
    //     cy.getByTestId('center-marker').should('not.exist');

    //     // Switch to pin mode
    //     cy.getByTestId('pin-on-map-mode').click();
    //     cy.getByTestId('pin-on-map-mode').should('have.class', 'bg-indigo-600');
    //     cy.getByTestId('pin-mode-coordinates').should('be.visible');
    //     cy.getByTestId('center-marker').should('be.visible');
    //     cy.getByTestId('address-search').should('not.exist');

    //     // Switch back to address search mode
    //     cy.getByTestId('search-address-mode').click();
    //     cy.getByTestId('search-address-mode').should('have.class', 'bg-indigo-600');
    //     cy.getByTestId('address-search').should('be.visible');
    //     cy.getByTestId('center-marker').should('not.exist');
    //     cy.getByTestId('pin-mode-coordinates').should('not.exist');
    // });

    // it('should display coordinates with 6 decimal precision', () => {
    //     // Open new issue sidebar
    //     cy.getByTestId('new-issue-button').click();
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');

    //     // Switch to pin mode
    //     cy.getByTestId('pin-on-map-mode').click();

    //     // Check coordinate format (6 decimal places)
    //     cy.getByTestId('latitude-display').invoke('text').then((lat) => {
    //         // Should match format: XX.XXXXXX (at least 6 decimal places)
    //         expect(lat).to.match(/^\d+\.\d{6}$/);
    //     });

    //     cy.getByTestId('longitude-display').invoke('text').then((lng) => {
    //         expect(lng).to.match(/^\d+\.\d{6}$/);
    //     });
    // });

    // it('should keep center marker fixed while panning', () => {
    //     // Open new issue sidebar
    //     cy.getByTestId('new-issue-button').click();
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');

    //     // Switch to pin mode
    //     cy.getByTestId('pin-on-map-mode').click();
    //     cy.getByTestId('center-marker').should('be.visible');

    //     // Get center marker position
    //     cy.getByTestId('center-marker').then(($marker) => {
    //         const initialPosition = $marker.position();

    //         // Pan the map
    //         cy.getByTestId('main-map')
    //             .trigger('mousedown', { which: 1, clientX: 400, clientY: 300 })
    //             .trigger('mousemove', { clientX: 500, clientY: 400 })
    //             .trigger('mouseup', { force: true });

    //         cy.wait(500);

    //         // Verify center marker position hasn't changed (it's fixed at viewport center)
    //         cy.getByTestId('center-marker').then(($newMarker) => {
    //             const newPosition = $newMarker.position();
    //             expect(newPosition.top).to.equal(initialPosition.top);
    //             expect(newPosition.left).to.equal(initialPosition.left);
    //         });
    //     });
    // });

    // it('should validate required fields in pin mode', () => {
    //     // Open new issue sidebar
    //     cy.getByTestId('new-issue-button').click();
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');

    //     // Switch to pin mode
    //     cy.getByTestId('pin-on-map-mode').click();

    //     // Try to submit without filling required fields
    //     cy.getByTestId('submit-issue').click();

    //     // Form should not submit (HTML5 validation should catch it)
    //     // URL should not change
    //     cy.url().should('match', /\/$/);
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');

    //     // Fill only title
    //     cy.getByTestId('issue-title').type('Test Issue');
    //     cy.getByTestId('submit-issue').click();

    //     // Should still not submit (missing issue type)
    //     cy.url().should('match', /\/$/);
    //     cy.getByTestId('new-issue-sidebar').should('be.visible');
    // });
});
