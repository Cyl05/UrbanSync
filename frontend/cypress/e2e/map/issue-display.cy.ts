describe("Map issue display", () => {
    const citizenEmail = "citizen@test.com";
    const citizenPassword = "password123";
    beforeEach(() => {
		cy.visit('http://localhost:5173/login');
		cy.getByTestId('email-input').type(citizenEmail);
		cy.getByTestId('password-input').type(citizenPassword);
		cy.getByTestId('submit-button').click();

		cy.wait(1000);
	});

    it("displays issues on map as markers", () => {
        cy.get(".leaflet-marker-pane").within(() => {
            cy.get("img").should("exist");
        });
    });

    it("marker icons display correctly", () => {
        cy.get(".leaflet-marker-pane").within(() => {
            cy.get("img").each(($img) => {
                cy.wrap($img).invoke("attr", "src").then((src) => {
                    expect(src).to.equal("https://i.ibb.co/Kz834gDZ/image-removebg-preview-5-removebg-preview.png");
                });
            });
        });
    });

    it("clicking marker opens issue mini popup", () => {
        cy.get(".leaflet-marker-icon").first().click({ force: true });

        cy.getByTestId("mini-issue-title").should("exist");
        if (cy.getByTestId("mini-issue-description").should("exist")) {
            cy.getByTestId("mini-issue-description").should("be.visible");
        }

        if (cy.getByTestId("mini-issue-image").should("exist")) {
            cy.getByTestId("mini-issue-image").should("be.visible");
        }
    });

    it("clicking view issue button takes user to issue page", () => {
        cy.get(".leaflet-marker-icon").first().then(($marker) => {
            $marker[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        cy.getByTestId("issue-view-button").should("exist").click({ force: true });

        cy.location("pathname", { timeout: 10000 }).should("match", /\/issue\/[a-f0-9-]+$/);
        cy.getByTestId("issue-title").should("be.visible");

        cy.getByTestId("issue-description-text").should("be.visible");
        cy.getByTestId("issue-photo").should("be.visible");
        cy.getByTestId("issue-status-badge").should("be.visible");
    });
});