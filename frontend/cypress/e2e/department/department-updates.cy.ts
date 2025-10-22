describe('Department Updates', () => {
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

	it('should display department update form on issue detail page', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				cy.getByTestId('department-update-form').should('be.visible');
				cy.getByTestId('update-textarea').should('be.visible');
				cy.getByTestId('submit-update-button').should('be.visible');
			}
		});
	});

	it('should post department update successfully', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				const updateMessage = `Test department update - ${Date.now()}`;
				
				cy.getByTestId('update-textarea').type(updateMessage);
				
				cy.getByTestId('submit-update-button').should('not.be.disabled');
				
				cy.getByTestId('submit-update-button').click();
				cy.wait(3000); 
				
				cy.getByTestId('department-updates-section').should('be.visible');
				cy.getByTestId('update-content').contains(updateMessage).should('be.visible');
			}
		});
	});

	it('should display author name and department badge on update', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				const updateMessage = `Update with author info - ${Date.now()}`;
				
				cy.getByTestId('update-textarea').type(updateMessage);
				cy.getByTestId('submit-update-button').click();
				cy.wait(3000);
				
				cy.getByTestId('update-content').contains(updateMessage).parents('[data-testid="department-update-item"]').within(() => {
					cy.getByTestId('update-author-name').should('be.visible');
					
					cy.getByTestId('update-department-badge').should('be.visible');
				});
			}
		});
	});

	it('should clear form after successful update submission', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				cy.getByTestId('update-textarea').type('Test update to verify form clears');
				cy.getByTestId('submit-update-button').click();
				cy.wait(3000);
				
				cy.getByTestId('update-textarea').should('have.value', '');
				cy.getByTestId('submit-update-button').should('be.disabled');
			}
		});
	});

	it('should allow any department official to update team issues', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('status-filter').select('all');
				cy.wait(500);
				
				cy.getByTestId('issue-card').eq(0).click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				cy.getByTestId('department-update-form').should('be.visible');
				
				cy.getByTestId('update-textarea').type('Team update from any official');
				cy.getByTestId('submit-update-button').should('not.be.disabled');
			}
		});
	});

	it('should disable submit button when textarea is empty', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				cy.getByTestId('submit-update-button').should('be.disabled');
				
				cy.getByTestId('update-textarea').type('Some text');
				cy.getByTestId('submit-update-button').should('not.be.disabled');
				
				cy.getByTestId('update-textarea').clear();
				cy.getByTestId('submit-update-button').should('be.disabled');
			}
		});
	});

	it('should show loading state while submitting update', () => {
		cy.getByTestId('stat-total-count').invoke('text').then((totalText) => {
			const total = parseInt(totalText);
			
			if (total > 0) {
				cy.getByTestId('issue-card').first().click();
				cy.url().should('match', /\/issue\/[a-f0-9-]+$/, { timeout: 10000 });
				cy.wait(1000);
				
				cy.getByTestId('update-textarea').type('Update to test loading state');
				
				cy.getByTestId('submit-update-button').click();
				
				cy.getByTestId('submit-update-button').should('contain', 'Publishing');
				
				cy.wait(3000);
				
				cy.getByTestId('submit-update-button').should('contain', 'Publish Update');
			}
		});
	});
});
