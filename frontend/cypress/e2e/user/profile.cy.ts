describe("User Profile", () => {
	const deptEmail = "dept@test.com";
	const password = "password123";

	beforeEach(() => {
		cy.visit('http://localhost:5173/login');
		cy.getByTestId('email-input').type(deptEmail);
		cy.getByTestId('password-input').type(password);
		cy.getByTestId('submit-button').click();

		cy.wait(1000);

		cy.visit("http://localhost:5173/profile");
		cy.url().should("match", /\/profile$/);
	});

	it("Shows user info", () => {
		cy.getByTestId("user-photo").should('exist');
		cy.getByTestId("user-name").should("exist");
		cy.getByTestId("user-role").should("exist");
		cy.getByTestId("user-email").should("exist");
		cy.getByTestId("user-created-at").should("exist");

		cy.getByTestId("user-total-issues").should("exist");
		cy.getByTestId("user-total-resolved").should("exist");
	});

	it("Shows department info for department users", () => {
		cy.getByTestId("user-role").invoke("text").then((userRole) => {
			expect(userRole).to.equal("Department");
		});

		cy.getByTestId("department-name").should("exist");
		cy.getByTestId("department-description").should("exist");
	});

	it("Edit Profile Picture", () => {
		cy.getByTestId("edit-button").click();

		cy.getByTestId("edit-profile-save").should("be.visible");
		cy.getByTestId("edit-profile-cancel").should("be.visible");
		cy.getByTestId("edit-profile-photo").should("be.visible");
		cy.getByTestId("edit-profile-name").should("be.visible");
		cy.getByTestId("edit-user-photo").should("be.visible");

		cy.getByTestId("edit-profile-photo").clear();
		cy.getByTestId("edit-profile-photo").type("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpAh63HncAuJOC6TxWkGLYpS0WwNXswz9MA&s");
		cy.getByTestId("edit-user-photo").invoke("attr", "Src").then((srcText) => {
			expect(srcText).to.equal("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpAh63HncAuJOC6TxWkGLYpS0WwNXswz9MA&s");
		});
		cy.getByTestId("edit-profile-save").click();
		cy.reload();

		cy.getByTestId("user-photo").invoke("attr", "src").then((srcText) => {
			expect(srcText).to.equal("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpAh63HncAuJOC6TxWkGLYpS0WwNXswz9MA&s");
		});
	});

	it("Remove Profile Picture and default", () => {
		cy.getByTestId("edit-button").click();

		cy.getByTestId("edit-profile-photo").clear();
		cy.getByTestId("edit-user-photo").invoke("attr", "Src").then((srcText) => {
			expect(srcText).to.equal("https://i.ibb.co/prXdx3gx/image.png");
		});
		cy.getByTestId("edit-profile-save").click();
		cy.reload();

		cy.getByTestId("user-photo").invoke("attr", "src").then((srcText) => {
			expect(srcText).to.equal("https://i.ibb.co/prXdx3gx/image.png");
		});
	});

	it("Cancel button cancels changes", () => {
		cy.getByTestId("edit-button").click();

		cy.getByTestId("edit-profile-photo").clear();
		cy.getByTestId("edit-profile-save").click();
		cy.reload();
		cy.getByTestId("user-photo").invoke("attr", "src").then((srcText) => {
			expect(srcText).to.equal("https://i.ibb.co/prXdx3gx/image.png");
		});

		cy.getByTestId("edit-button").click();
		cy.getByTestId("edit-profile-photo").type("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpAh63HncAuJOC6TxWkGLYpS0WwNXswz9MA&s");
		cy.getByTestId("edit-user-photo").invoke("attr", "src").then((srcText) => {
			expect(srcText).to.equal("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPpAh63HncAuJOC6TxWkGLYpS0WwNXswz9MA&s");
		});
		cy.getByTestId("edit-profile-cancel").click();
		cy.reload();

		cy.getByTestId("user-photo").invoke("attr", "src").then((srcText) => {
			expect(srcText).to.equal("https://i.ibb.co/prXdx3gx/image.png");
		});
	});

	it("Edit username", () => {
		cy.getByTestId("edit-button").click();

		cy.getByTestId("edit-profile-name").clear();
		cy.getByTestId("edit-profile-name").type("Test User");
		cy.getByTestId("edit-profile-save").click();
		cy.reload();

		cy.getByTestId("user-name").invoke("text").then((username) => {
			expect(username).to.equal("Test User");
		});
	});

	it("Check if issues add up", () => {
		cy.getByTestId("user-total-issues").invoke("text").then((totalIssueCount) => {
			const totalCount = parseInt(totalIssueCount);
			cy.getByTestId("profile-issue-selector").should("have.value", "all");
			cy.getByTestId("issue-card").should("have.length", totalCount);
		});

		cy.getByTestId("user-total-resolved").invoke("text").then((totalResolvedCount) => {
			const resolvedCount = parseInt(totalResolvedCount);
			cy.getByTestId("profile-issue-selector").select('resolved');
			cy.getByTestId("issue-card").should("have.length", resolvedCount);
		});
	});

	it("Clicking on issue should take user to Issue page", () => {
		cy.getByTestId("user-total-issues").invoke("text").then((totalCount) => {
			const total = parseInt(totalCount);
			if (total > 0) {
				cy.getByTestId("issue-card").first().click();
				cy.url().should("match", /\/issue\/[a-f0-9-]+$/);
			}
		});
	});
});