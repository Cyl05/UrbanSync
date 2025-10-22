describe('Department Dashboard', () => {
	const deptEmail = 'dept@test.com';
	const deptPassword = 'password123';

	beforeEach(() => {
		cy.visit('http://localhost:5173/login');
		cy.getByTestId('email-input').type(deptEmail);
		cy.getByTestId('password-input').type(deptPassword);
		cy.getByTestId('submit-button').click();

		cy.url().should('include', '/dashboard', { timeout: 10000 });
		cy.wait(1000);
	});

	it('should display department dashboard with correct header', () => {
		cy.getByTestId('department-dashboard').should('be.visible');
		cy.getByTestId('department-name').should('be.visible');
		cy.contains('Department Dashboard').should('be.visible');
	});

	it('should show statistics cards with correct counts', () => {
		cy.getByTestId('stat-total').should('be.visible');
		cy.getByTestId('stat-new').should('be.visible');
		cy.getByTestId('stat-in-progress').should('be.visible');
		cy.getByTestId('stat-resolved').should('be.visible');

		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			cy.getByTestId('stat-new-count').invoke('text').then((newText) => {
				const newCount = parseInt(newText);
				
				cy.getByTestId('stat-in-progress-count').invoke('text').then((inProgressText) => {
					const inProgressCount = parseInt(inProgressText);
					
					cy.getByTestId('stat-resolved-count').invoke('text').then((resolvedText) => {
						const resolvedCount = parseInt(resolvedText);
						
						expect(newCount + inProgressCount + resolvedCount).to.equal(total);
					});
				});
			});
		});
	});

	it('should display issues list when department has assigned issues', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issues-list').should('be.visible');
				cy.getByTestId('issue-card').should('have.length.at.least', 1);
			} else {
				cy.getByTestId('no-issues-message').should('be.visible');
			}
		});
	});

	it('should filter issues by status', () => {
		cy.getByTestId('stat-new-count').invoke('text').then((newText) => {
			const newCount = parseInt(newText);
			
			cy.getByTestId('status-filter').select('new');
			cy.wait(500);
			
			if (newCount > 0) {
				cy.getByTestId('issues-list').should('be.visible');
				cy.getByTestId('issue-card').should('have.length', newCount);
			} else {
				cy.getByTestId('no-issues-message').should('be.visible');
			}
		});

		cy.getByTestId('stat-in-progress-count').invoke('text').then((inProgressText) => {
			const inProgressCount = parseInt(inProgressText);
			
			cy.getByTestId('status-filter').select('in_progress');
			cy.wait(500);
			
			if (inProgressCount > 0) {
				cy.getByTestId('issues-list').should('be.visible');
			} else {
				cy.getByTestId('no-issues-message').should('be.visible');
			}
		});

		cy.getByTestId('stat-resolved-count').invoke('text').then((resolvedText) => {
			const resolvedCount = parseInt(resolvedText);
			
			cy.getByTestId('status-filter').select('resolved');
			cy.wait(500);
			
			if (resolvedCount > 0) {
				cy.getByTestId('issues-list').should('be.visible');
			} else {
				cy.getByTestId('no-issues-message').should('be.visible');
			}
		});

		cy.getByTestId('status-filter').select('all');
		cy.wait(500);
	});

	it('should navigate to issue detail when clicking an issue card', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/);
			}
		});
	});

	it('should navigate back to map when clicking back button', () => {
		cy.getByTestId('back-to-map-button').click();
		cy.url().should('match', /\/$|\/$/);
	});

	it('should only show issues assigned to this department', () => {
		cy.getByTestId('department-name').should('be.visible');
		
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('status-dropdown').should('have.length.at.least', 1);
			}
		});
	});
});
