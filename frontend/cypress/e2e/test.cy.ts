describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://localhost:5173');
		cy.get("[data-test=login-button]");
	});
});