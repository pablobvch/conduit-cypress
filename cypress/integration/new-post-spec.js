/// <reference types="cypress">

describe("New Post on Conduit", () => {
  beforeEach(() => {
    cy.task("cleanDatabase");
    cy.registerUserIfNeeded();
    cy.login();

    //define aliases
    cy.get("[data-cy=new-post]").click().as("ClickOnNewPost");
    cy.get("[data-cy=title]").as("Title");
    cy.get("[data-cy=about]").as("About");
    cy.get("[data-cy=article]").as("Article");
    cy.get("[data-cy=tags]").as("Tags");
    cy.get("[data-cy=publish]").as("Publish");

    //cy.get("[data-cy=publish]").click().as("ClickPublish"); //Dont create state changing aliases within beforeEach
  });

  it("write a new post", () => {
    cy.get("[data-cy=new-post]").click();
    cy.get("@Title").type("My New Post");
    cy.get("@About").type(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. "
    );
    cy.get("@Article").type(
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga."
    );
    cy.get("@Tags").type("test{enter}");
    cy.get("@Publish").click();

    cy.location("pathname").should("equal", "/article/my-new-post");
  });

  it("edit article", () => {
    // Fill details to write a new post
    cy.get("[data-cy=new-post]").click();
    cy.get("@Title").type("My New Post");
    cy.get("@About").type(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. "
    );
    cy.get("@Article").type(
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga."
    );
    cy.get("@Tags").type("test{enter}");
    cy.get("@Publish").click();

    // assertion to check url
    cy.location("pathname").should("equal", "/article/my-new-post");

    // editing the article
    cy.get("[data-cy=edit-article]").click();
    cy.location("pathname").should("equal", "/editor/my-new-post");

    cy.get("@Title").clear().type("My Edited Title");
    cy.get("@About").clear().type("New About information");
    cy.get("@Tags").clear().type("MyNewTag{enter}");

    cy.get("@Publish").click();
    cy.location("pathname").should("equal", "/article/my-edited-title");
  });

  it("favorite an article test", () => {
    cy.get("[data-cy=new-post]").click();
    cy.get("@Title").type("My New Post");
    cy.get("@About").type(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. "
    );
    cy.get("@Article").type(
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga."
    );
    cy.get("@Tags").type("test{enter}");
    cy.get("@Publish").click();

    // assertion to check url
    cy.location("pathname").should("equal", "/article/my-new-post");

    cy.get("[data-cy=profile]").click();
    cy.location("pathname").should("equal", "/@testuser");
    cy.get(".article-preview")
      .should("have.length", 1)
      .first()
      .find("[data-cy=fav-article]")
      .click();
    cy.get();
  });
});
