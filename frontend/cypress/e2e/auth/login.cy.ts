describe('Login User Journey', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5173/login');
	});

	context('Successful Login with Role-Based Redirects', () => {
		it('should redirect citizen to home (/) after successful login', () => {
			const citizenEmail = 'citizen@test.com';
			const password = 'password123';

			cy.getByTestId('email-input').type(citizenEmail);
			cy.getByTestId('password-input').type(password);
			cy.getByTestId('submit-button').click();

			cy.url().should('match', /\/$|\/$/);
			
			cy.contains('Profile').should('be.visible');
		});

		it('should redirect department user to dashboard after successful login', () => {
			const deptEmail = 'dept@test.com';
			const password = 'password123';

			cy.getByTestId('email-input').type(deptEmail);
			cy.getByTestId('password-input').type(password);
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard');
		});
	});

	context('Invalid Credentials', () => {
		it('should show error message with invalid email', () => {
			cy.getByTestId('email-input').type('nonexistent@test.com');
			cy.getByTestId('password-input').type('wrongpassword');
			cy.getByTestId('submit-button').click();

			cy.getByTestId('error-message').should('be.visible');
			cy.contains(/invalid email or password/i).should('be.visible');
		});

		it('should show error message with wrong password', () => {
			cy.getByTestId('email-input').type('citizen@test.com');
			cy.getByTestId('password-input').type('wrongpassword123');
			cy.getByTestId('submit-button').click();

			cy.getByTestId('error-message').should('be.visible');
			cy.contains(/invalid email or password/i).should('be.visible');
		});

		it('should show error when email field is empty', () => {
			cy.getByTestId('password-input').type('password123');
			cy.getByTestId('submit-button').click();

			cy.contains('Email is required').should('be.visible');
		});

		it('should show error when password field is empty', () => {
			cy.getByTestId('email-input').type('citizen@test.com');
			cy.getByTestId('submit-button').click();

			cy.contains('Password is required').should('be.visible');
		});
	});

	context('Session Persistence', () => {
		it('should maintain login state after page refresh', () => {
			const citizenEmail = 'citizen@test.com';
			const password = 'password123';

			cy.getByTestId('email-input').type(citizenEmail);
			cy.getByTestId('password-input').type(password);
			cy.getByTestId('submit-button').click();

			cy.url().should('match', /\/$|\/$/, { timeout: 10000 });

			cy.reload();

			cy.url().should('not.include', '/login');
			
			cy.contains('Profile').should('be.visible');
		});

		it('should redirect to intended page after login when accessing protected route', () => {
			cy.visit('http://localhost:5173/dashboard');

			cy.url().should('include', '/login');

			cy.getByTestId('email-input').type('dept@test.com');
			cy.getByTestId('password-input').type('password123');
			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/dashboard');
		});
	});

	context('UI Feedback', () => {
		it('should show loading state when submitting login form', () => {
			cy.getByTestId('email-input').type('citizen@test.com');
			cy.getByTestId('password-input').type('password123');
			cy.getByTestId('submit-button').click();

			cy.contains('Logging in...').should('be.visible');
		});

		it('should toggle password visibility', () => {
			cy.getByTestId('password-input').type('testpassword');
			
			cy.getByTestId('password-input').should('have.attr', 'type', 'password');

			cy.get('button[type="button"]').filter(':has(svg)').first().click();
			
			cy.getByTestId('password-input').should('have.attr', 'type', 'text');
		});
	});

	context('Navigation', () => {
		it('should navigate to register page when "Register here" link is clicked', () => {
			cy.contains('Register here').click();
			cy.url().should('include', '/register');
		});

		it('should navigate to home page when "Back to map" link is clicked', () => {
			cy.contains('Back to map').click();
			cy.url().should('match', /\/$|\/$/);
		});
	});
});
