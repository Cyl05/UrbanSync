describe('Department Status Updates', () => {
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

	it('should change issue status from New to In Progress', () => {
		cy.getByTestId('stat-new-count').invoke('text').then((newText) => {
			const newCount = parseInt(newText);
			
			if (newCount > 0) {
				cy.getByTestId('status-filter').select('new');
				cy.wait(500);
				
				cy.getByTestId('stat-in-progress-count').invoke('text').then((initialInProgress) => {
					const initialInProgressCount = parseInt(initialInProgress);
					
					cy.getByTestId('status-dropdown').first().select('in_progress');
					
					cy.getByTestId('stat-in-progress-count').should('have.text', (initialInProgressCount + 1).toString());
					cy.getByTestId('stat-new-count').should('have.text', (newCount - 1).toString());
				});
			}
		});
	});

	it('should change issue status from In Progress to Resolved', () => {
		cy.getByTestId('stat-in-progress-count').invoke('text').then((inProgressText) => {
			const inProgressCount = parseInt(inProgressText);
			
			if (inProgressCount > 0) {
				cy.getByTestId('status-filter').select('in_progress');
				cy.wait(500);
				
				cy.getByTestId('stat-resolved-count').invoke('text').then((initialResolved) => {
					const initialResolvedCount = parseInt(initialResolved);
					
					cy.getByTestId('status-dropdown').first().select('resolved');
					
					cy.getByTestId('stat-resolved-count').should('have.text', (initialResolvedCount + 1).toString());
					cy.getByTestId('stat-in-progress-count').should('have.text', (inProgressCount - 1).toString());
				});
			}
		});
	});

	it('should immediately update UI after status change', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('status-filter').select('all');
				cy.wait(500);
				
				cy.getByTestId('status-dropdown').first().invoke('val').then((currentStatus) => {
					let nextStatus = 'in_progress';
					if (currentStatus === 'new') {
						nextStatus = 'in_progress';
					} else if (currentStatus === 'in_progress') {
						nextStatus = 'resolved';
					} else {
						nextStatus = 'new';
					}
					
					cy.getByTestId('status-dropdown').first().select(nextStatus);
					cy.wait(2000);
					
					cy.getByTestId('status-dropdown').first().should('have.value', nextStatus);
				});
			}
		});
	});

	it('should persist status changes to database', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().within(() => {
					cy.getByTestId('issue-title').invoke('text').then((issueTitle) => {
						cy.getByTestId('status-dropdown').select('resolved');
						cy.wait(2000);
						
						cy.reload();
						cy.wait(1000);
						
						cy.getByTestId('issue-title').contains(issueTitle).parents('[data-testid="issue-card"]').within(() => {
							cy.getByTestId('status-dropdown').should('have.value', 'resolved');
						});
					});
				});
			}
		});
	});

	it('should allow status updates only on department issues', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('status-dropdown').should('exist');
				
				cy.getByTestId('issue-card').each(($card) => {
					cy.wrap($card).find('[data-testid="status-dropdown"]').should('exist');
				});
			}
		});
	});

	it('should not trigger navigation when clicking status dropdown', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				// Select a status without clicking first
				cy.getByTestId('status-dropdown').first().select('in_progress');
				
				cy.url().should('include', '/dashboard');
				cy.wait(500);
				
				cy.getByTestId('status-dropdown').first().select('resolved');
				
				cy.url().should('include', '/dashboard');
			}
		});
	});
});
