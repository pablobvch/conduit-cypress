/// <reference types="cypress" />
import "@bahmutov/cy-api/support";
import "@cypress/code-coverage/support";

const apiUrl = Cypress.env("apiUrl");

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false //disable the screenshot feature
});

// a custom Cypress command to login using XHR call
// and then set the received token in the local storage
// can log in with default user or with a given one
Cypress.Commands.add("login", (user = Cypress.env("user")) => {
  cy.getLoginToken(user).then((token) => {
    localStorage.setItem("jwt", token);
    // with this token set, when we visit the page
    // the web application will have the user logged in
  });

  cy.visit("/");
  cy.get("[data-cy=global-feed]").should("be.visible");
});

// custom Cypress command to simply return a token after logging in
// useful to perform authorized API calls
Cypress.Commands.add("getLoginToken", (user = Cypress.env("user")) => {
  return cy
    .request("POST", `${apiUrl}/api/users/login`, {
      user: Cypress._.pick(user, ["email", "password"])
    })
    .its("body.user.token")
    .should("exist");
});

// creates a user with email and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add("registerUserIfNeeded", (options = {}) => {
  const defaults = {
    image: "https://robohash.org/6FJ.png?set=set3&size=150x150",
    // email, password
    ...Cypress.env("user")
  };
  const user = Cypress._.defaults({}, options, defaults);
  cy.request({
    method: "POST",
    url: `${apiUrl}/api/users`,
    body: {
      user
    },
    failOnStatusCode: false
  });
});

/**
 * Dispatches a given Redux action straight to the application
 */
Cypress.Commands.add("dispatch", (action) => {
  expect(action).to.be.an("object").and.to.have.property("type");
  cy.window().its("store").invoke("dispatch", action);
});

/**
 * Checks if the given object have all the keys for creating a new article
 */
const checkArticle = (fields) => {
  expect(fields)
    .to.be.an("object")
    .and.to.have.all.keys(["title", "description", "body", "tagList"]);
};

/**
 * Single command to write a post via UI (with a few Redux shortcuts)
 */
Cypress.Commands.add("article", (fields) => {
  checkArticle(fields);

  // can we create an article using `cy.task`?

  // TODO use data-cy for new post link
  cy.contains("a.nav-link", "New Post").click();
  cy.location("pathname").should("equal", "/editor");

  // separate Redux actions for each field
  cy.dispatch({
    type: "UPDATE_FIELD_EDITOR",
    key: "title",
    value: fields.title
  });

  cy.dispatch({
    type: "UPDATE_FIELD_EDITOR",
    key: "description",
    value: fields.description
  });

  cy.dispatch({
    type: "UPDATE_FIELD_EDITOR",
    key: "body",
    value: fields.body
  });

  if (fields.tagList.length) {
    cy.get("[data-cy=tags]").type(fields.tagList.join("{enter}") + "{enter}");
    cy.get(".tag-pill").should("have.length", fields.tagList.length);
  }
  cy.get("[data-cy=publish]").click();

  cy.location("pathname").should("not.equal", "/editor");
});

Cypress.Commands.add("postArticle", (fields) => {
  checkArticle(fields);
  const jwt = localStorage.getItem("jwt");
  expect(jwt, "jwt token").to.be.a("string");

  cy.request({
    method: "POST",
    url: `${apiUrl}/api/articles`,
    body: {
      article: fields
    },
    headers: {
      authorization: `Token ${jwt}`
    }
  });
});

Cypress.Commands.add("writeArticle", (article) => {
  cy.window()
    .its("agent.Articles")
    .invoke("create", article) // resolves with new article object
    .its("article.slug")
    .then((slug) => {
      // make sure the article fully loads
      // including its comments before proceeding
      cy.server();
      cy.route(`/api/articles/${slug}/comments`).as("comments");
      cy.visit(`/article/${slug}`);
      cy.wait("@comments");
      cy.wrap(slug);
    });
});

Cypress.Commands.add("postComment", (articleSlug, text) => {
  const jwt = localStorage.getItem("jwt");
  expect(jwt, "jwt token").to.be.a("string");

  cy.request({
    method: "POST",
    url: `${apiUrl}/api/articles/${articleSlug}/comments`,
    body: {
      comment: {
        body: text
      }
    },
    headers: {
      authorization: `Token ${jwt}`
    }
  });
  cy.reload();
});
//without stubbing. there is no response to the route
//Cypress will pass the request without stubbing to the server
//wait for request to resolve later
Cypress.Commands.add("postArticle", (fields) => {
  checkArticle(fields);
  const jwt = localStorage.getItem("jwt");
  expect(jwt, "jwt token").to.be.a("string");
  cy.request({
    method: "POST",
    url: `${apiUrl}/api/articles`,
    body: { article: fields },
    headers: { authorization: `Token ${jwt}` }
  });
});
// With stubbing
// Pass a response to cy.route
// Cypress will stub the response in the request
Cypress.Commands.add("writeArticleAndPostComment", (article) => {
  cy.window()
    .its("agent.Articles")
    .invoke("create", article) // resolves with new article object
    .its("article.slug")
    .then((slug) => {
      cy.server();
      cy.route(`/api/articles/${slug}/comments`, {
        comments: [
          {
            id: 1,
            createdAt: "2020-04-21T16:17:02.585Z",
            updatedAt: "2020-04-21T16:17:02.585Z",
            body: "Great post",
            author: {
              id: 1,
              username: "testuser",
              bio: "My stubbed bio",
              image: "https://robohash.org/6FJ.png?set=set3&size=150x150",
              following: false
            }
          }
        ]
      }).as("comments");
      cy.visit(`/article/${slug}`);
      cy.wait("@comments");
      cy.wrap(slug);
    });
});

//stubbing empty response
//There are other options sending empty responses
//delete scenario
//Pass a empty JSON response to cy.route
