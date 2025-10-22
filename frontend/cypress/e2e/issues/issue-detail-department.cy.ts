describe("Issue Detail View Citizen", () => {
    const deptEmail = 'dept@test.com';
    const password = 'password123';
    const issueId = 'c0f0a8c8-9a8c-49a4-a9fa-67397403e9dd';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.getByTestId('login-button').click();
        cy.getByTestId('email-input').type(deptEmail);
        cy.getByTestId('password-input').type(password);
        cy.getByTestId('submit-button').click();
        cy.url().should('include', '/dashboard', { timeout: 10000 });
        cy.wait(1000);
    });

    it('should see all citizen features (photo, title, description, location, comments)', () => {
        cy.visit(`http://localhost:5173/issue/${issueId}`);
        cy.wait(1000);

        cy.getByTestId('issue-photo').should('be.visible');

        cy.contains('Test Issue - Garbage Collection').should('be.visible');

        cy.getByTestId('issue-description-text').should('contain', 'Lot of garbage has been accumulated here, please clean ASAP.');

        cy.get("iframe").should("be.visible");

		cy.getByTestId('issue-latitude').should('be.visible');
		cy.getByTestId('issue-longitude').should('be.visible');

        cy.getByTestId('issue-comments-section').should('be.visible');
        cy.getByTestId('comment-item').should('have.length.at.least', 1);
    });

    it('should be able to post comment as department user', () => {
        cy.visit(`http://localhost:5173/issue/${issueId}`);
        cy.wait(1000);

        cy.getByTestId('comment-form').should('be.visible');
        cy.getByTestId('comment-textarea').type('Test comment from department user');
        cy.getByTestId('comment-submit-button').click();

        cy.wait(2000);
        cy.getByTestId('comment-content').contains('Test comment from department user').should('be.visible');
    });

    it('should post department update if issue is assigned to their department', () => {
        cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
            const total = parseInt(totalText);

            if (total > 0) {
                cy.getByTestId('issue-card').first().click();
                cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
                cy.wait(1000);

                cy.getByTestId('department-update-form').should('be.visible');
                cy.getByTestId('update-textarea').should('be.visible');
                cy.getByTestId('submit-update-button').should('be.visible');

                cy.getByTestId('update-textarea').type('Official department update from test');
                cy.getByTestId('submit-update-button').click();

                cy.wait(3000);

                cy.getByTestId('department-updates-section').should('be.visible');
                cy.getByTestId('update-content').contains('Official department update from test').should('be.visible');
            }
        });
    });
});