describe("comments", () => {
  beforeEach(() => {
    cy.task("cleanDatabase");
    cy.registerUserIfNeeded();
    cy.login();
  });

  const article = {
    title: "My new article",
    description: "About a topic",
    body: "This is a new post",
    tagList: ["test"]
  };

  //Test with stubbed response
  it("Test post comments with stubbed response", () => {
    cy.writeArticleAndPostComment(article);
    cy.contains("[data-cy=comment]", "Great post").should("be.visible");
  });

  //Test with response from server
  it("Test post comments waiting for server response", () => {
    cy.postArticle(article);
    cy.postComment("my-new-article", "My new comment");
    cy.visit("http://localhost:4100/article/my-new-article");
    cy.contains("[data-cy=comment]", "My new comment").should("be.visible");
  });
});
