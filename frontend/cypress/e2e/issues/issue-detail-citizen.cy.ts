describe("Issue Detail View Citizen", () => {
	const citizenEmail = 'citizen@test.com';
	const citizenPassword = 'password123';

	beforeEach(() => {
		cy.visit('http://localhost:5173/login');
		cy.getByTestId('email-input').type(citizenEmail);
		cy.getByTestId('password-input').type(citizenPassword);
		cy.getByTestId('submit-button').click();

		cy.wait(1000);

		cy.visit(`http://localhost:5173/issue/c0f0a8c8-9a8c-49a4-a9fa-67397403e9dd`);
		cy.wait(1000);
	});

	it('should see issue photo', () => {
		cy.getByTestId('issue-photo').should('be.visible');
		cy.getByTestId('issue-photo').should('have.attr', 'src').and('include', 'upload.wikimedia.org');
	});

	it('should see issue title and status badge', () => {
		cy.contains('Test Issue - Garbage Collection').should('be.visible');
		cy.get('span').contains('New').should('be.visible');
	});

	it('should see issue description', () => {
		cy.getByTestId('issue-description-text').should('contain', 'Lot of garbage has been accumulated here, please clean ASAP.');
	});

	it('should view location on embedded map', () => {
		cy.get("iframe").should("be.visible");

		cy.getByTestId('issue-latitude').should('be.visible');
		cy.getByTestId('issue-longitude').should('be.visible');
	});

	it('should read public comments', () => {
		cy.getByTestId('issue-comments-section').should('be.visible');
		cy.getByTestId('comment-item').should('have.length.at.least', 1);
		cy.getByTestId('comment-content').contains('Test comment').should('be.visible');
		cy.getByTestId('comment-author').should('be.visible');
		cy.getByTestId('comment-timestamp').should('be.visible');
	});

	it('should read department updates (if any exist)', () => {
		cy.get('body').then(($body) => {
			if ($body.find('[data-testid="department-updates-section"]').length > 0) {
				cy.getByTestId('department-updates-section').should('be.visible');
				cy.getByTestId('department-update-item').should('have.length.at.least', 1);
				cy.getByTestId('update-content').should('be.visible');
				cy.getByTestId('update-author-name').should('be.visible');
				cy.getByTestId('update-department-badge').should('be.visible');
			}
		});
	});
});