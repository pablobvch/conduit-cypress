/// <reference types="cypress" />

describe("Login", () => {
  it("doesnt work because wrong credentials", () => {
    cy.visit("localhost:4100"); //parent command
    cy.get("[data-cy=sign-in]").click();
    cy.get("[data-cy=email]").type("info");
    cy.get("[data-cy=password]").type("visitor");
    cy.get("[data-cy=login-form]").submit();
    cy.contains(".error-messages li", "email must be a valid email");
    cy.location("pathname").should("equal", "/login");
  });

  it("happy path test", () => {
    cy.visit("localhost:4100"); //parent command
    cy.get("[data-cy=sign-in]").click();
    cy.get("[data-cy=email]").type("info@mail.com");
    cy.get("[data-cy=password]").type("visiting");
    cy.get("[data-cy=login-form]").submit();

    cy.location("pathname").should("equal", "/");
    cy.get("[data-cy=profile]").should("be.visible");
    cy.contains("a.nav-link", "Your Feed").should(
      "have.class",
      "nav-link active"
    );
    cy.contains("a.nav-link", "Global Feed").should(
      "not.have.class",
      "nav-link active"
    );

    cy.contains("a.nav-link", "Global Feed").click();
    cy.contains("a.nav-link", "Global Feed").should(
      "have.class",
      "nav-link active"
    );
  });
});
