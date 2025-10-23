describe("Comments", () => {
    const citizenEmail = "citizen@test.com";
    const citizenPassword = "password123";

    beforeEach(() => {
		cy.visit('http://localhost:5173/login');
		cy.getByTestId('email-input').type(citizenEmail);
		cy.getByTestId('password-input').type(citizenPassword);
		cy.getByTestId('submit-button').click();

        cy.wait(1000);
        cy.visit("http://localhost:5173/issue/c0f0a8c8-9a8c-49a4-a9fa-67397403e9dd");
	});

    it("Authenticated users can comment", () => {
        cy.getByTestId("comment-submit-button").should("be.disabled");
        cy.getByTestId("comment-textarea").type("Test Comment by Citizen");
        cy.getByTestId("comment-submit-button").should("not.be.disabled");
    });

    it("Anonymous users see login prompt", () => {
        cy.visit("http://localhost:5173/profile");
        cy.wait(1000);
        cy.getByTestId("sign-out-button").click();
        cy.reload();

        cy.visit("http://localhost:5173/issue/c0f0a8c8-9a8c-49a4-a9fa-67397403e9dd");
        cy.getByTestId("anonymous-login-prompt").should("be.visible");
    });

    it("Comment appears immediately after submit", () => {
        cy.getByTestId("comment-textarea").type("Test Comment by Citizen");
        cy.getByTestId("comment-submit-button").click();

        cy.getByTestId("comment-content").contains("Test Comment by Citizen").should("exist");
    });

    it("Shows author name and role", () => {
        cy.getByTestId("comment-item").first().within(() => {
            cy.getByTestId("comment-author").should("be.visible");
            cy.getByTestId("comment-author-role").should("be.visible");
        });
    });
});