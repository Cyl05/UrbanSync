describe('Logout User Journey', () => {
	const citizenEmail = 'citizen@test.com';
	const citizenPassword = 'password123';
	const deptEmail = 'dept@test.com';
	const deptPassword = 'password123';

	context('Sign Out Functionality', () => {
		it('should clear session and redirect to home page after logout (citizen)', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(citizenEmail);
			cy.getByTestId('password-input').type(citizenPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('match', /\/$|\/$/);
			cy.contains('Profile', { timeout: 10000 }).should('be.visible').click();

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.contains('Profile').should('not.exist');
		});

		it('should clear session and redirect to home page after logout (department user)', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(deptEmail);
			cy.getByTestId('password-input').type(deptPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard', { timeout: 10000 });

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.visit('http://localhost:5173/dashboard');
			cy.url().should('include', '/login');
		});
	});

	context('Protected Routes After Logout', () => {
		it('should redirect to login when accessing profile after logout (citizen)', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(citizenEmail);
			cy.getByTestId('password-input').type(citizenPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('match', /\/$|\/$/);
			cy.contains('Profile', { timeout: 10000 }).should('be.visible').click();

			cy.url().should('include', '/profile');

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.visit('http://localhost:5173/profile');

			cy.url().should('include', '/login');
		});

		it('should redirect to login when accessing dashboard after logout (department user)', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(deptEmail);
			cy.getByTestId('password-input').type(deptPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard', { timeout: 10000 });

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.visit('http://localhost:5173/dashboard');

			cy.url().should('include', '/login');
		});
	});

	context('Session Cleared', () => {
		it('should not persist user data after logout and refresh', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(citizenEmail);
			cy.getByTestId('password-input').type(citizenPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('match', /\/$|\/$/);
			cy.contains('Profile', { timeout: 10000 }).should('be.visible').click();

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.reload();

			cy.url().should('match', /\/$|\/$/);
			cy.contains('Profile').should('not.exist');

			cy.contains('Login').should('be.visible');
		});

		it('should require login again after logout', () => {
			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(deptEmail);
			cy.getByTestId('password-input').type(deptPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard', { timeout: 10000 });

			cy.contains('Sign Out').click();

			cy.url().should('match', /\/$|\/$/);

			cy.visit('http://localhost:5173/login');
			cy.getByTestId('email-input').type(deptEmail);
			cy.getByTestId('password-input').type(deptPassword);
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard', { timeout: 10000 });
		});
	});
});
