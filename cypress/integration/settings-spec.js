/// <reference types="cypress" />

describe("Settings on Conduit", () => {
  beforeEach(() => {
    cy.task("cleanDatabase");
    cy.registerUserIfNeeded();
    cy.login();
  });

  it("settings happy flow", () => {
    cy.get("[data-cy=profile]").click();
    cy.get("[data-cy=edit-profile-settings]").click();
    cy.get("[data-cy=username]").clear().type("Updated user name");
    cy.get("[data-cy=bio]")
      .clear()
      .type(
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
      );
    cy.get("form").submit();
  });
});
