describe('Registration User Journey', () => {
	beforeEach(() => {
		cy.visit('http://localhost:5173/register');
	});

	context('Citizen Registration', () => {
		it('should successfully register a citizen with valid credentials', () => {
			const timestamp = Date.now();
			const email = `citizen${timestamp}@test.com`;
			const password = 'SecurePass123!';

			cy.getByTestId('email-input').type(email);
			cy.getByTestId('role-select').select('citizen');
			cy.getByTestId('password-input').type(password);
			cy.getByTestId('confirm-password-input').type(password);

			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/login');
		});

		it('should display form with default citizen role selected', () => {
			cy.getByTestId('role-select').should('have.value', 'citizen');
			cy.getByTestId('department-select').should('not.exist');
		});
	});

	context('Department User Registration', () => {
		it('should successfully register a department user with department selection', () => {
			const timestamp = Date.now();
			const email = `dept${timestamp}@test.com`;
			const password = 'SecurePass123!';

			cy.getByTestId('email-input').type(email);
			cy.getByTestId('role-select').select('department');

			cy.getByTestId('department-select').should('be.visible');

			cy.getByTestId('department-select').select(1);

			cy.getByTestId('password-input').type(password);
			cy.getByTestId('confirm-password-input').type(password);

			cy.getByTestId('submit-button').click();

			cy.url().should('include', '/login');
		});

		it('should show department dropdown when department role is selected', () => {
			cy.getByTestId('role-select').select('department');
			cy.getByTestId('department-select').should('be.visible');
		});

		it('should hide department dropdown when citizen role is selected', () => {
			cy.getByTestId('role-select').select('department');
			cy.getByTestId('department-select').should('be.visible');

			cy.getByTestId('role-select').select('citizen');
			cy.getByTestId('department-select').should('not.exist');
		});
	});

	context('Form Validation', () => {
		it('should show error for weak password (less than 6 characters)', () => {
			cy.getByTestId('email-input').type('user@test.com');
			cy.getByTestId('password-input').type('12345');
			cy.getByTestId('confirm-password-input').type('12345');
			cy.getByTestId('submit-button').click();

			cy.contains('Password must be at least 6 characters long').should('be.visible');
		});

		it('should show error when passwords do not match', () => {
			cy.getByTestId('email-input').type('user@test.com');
			cy.getByTestId('password-input').type('SecurePass123!');
			cy.getByTestId('confirm-password-input').type('DifferentPass123!');
			cy.getByTestId('submit-button').click();

			cy.contains('Passwords do not match').should('be.visible');
		});

		it('should show error when email field is empty', () => {
			cy.getByTestId('password-input').type('SecurePass123!');
			cy.getByTestId('confirm-password-input').type('SecurePass123!');
			cy.getByTestId('submit-button').click();

			cy.contains('Email is required').should('be.visible');
		});

		it('should show error when password field is empty', () => {
			cy.getByTestId('email-input').type('user@test.com');
			cy.getByTestId('confirm-password-input').type('SecurePass123!');
			cy.getByTestId('submit-button').click();

			cy.contains('Password is required').should('be.visible');
		});

		it('should show error when department is not selected for department users', () => {
			cy.getByTestId('email-input').type('dept@test.com');
			cy.getByTestId('role-select').select('department');
			cy.getByTestId('password-input').type('SecurePass123!');
			cy.getByTestId('confirm-password-input').type('SecurePass123!');
			cy.getByTestId('submit-button').click();

			cy.contains('Please select a department').should('be.visible');
		});
	});

	context('Navigation', () => {
		it('should navigate to login page when "Sign in here" link is clicked', () => {
			cy.contains('Sign in here').click();
			cy.url().should('include', '/login');
		});

		it('should navigate to home page when "Back to map" link is clicked', () => {
			cy.contains('Back to map').click();
			cy.url().should('match', /\/$|\/$/);
		});
	});
});
