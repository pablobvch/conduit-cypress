/// <reference types="cypress" />

describe("My first test suite",()=>{
    it("test url works",()=>{
        cy.visit("localhost:4100") //parent command
    })

    it("test signup exists",()=>{
        cy.contains("a.nav-link","Sign up").click()
        //contains is a parent command
        //click is a child command
    })
})

//Parent commands
//cy.get("form") get an element from the UI
//cy.request("http://dev.local/seed")
//cy.exec("npm run build")
//cy.route("users/**")

////////////////////////////////////////////////////////////

/// Child commands: click, type, find, should
//cy.get("data-cy=username").click()
//cy.get("data-cy=username").type(username)
//cy.get(".article").find("footer")
//cy.contains("Login").should("be.visible")

////////////////////////////////////////////////////////////

//Dual commands: examples

//cy.contains()
//cy.screenshot()
//cy.scrollTo()
//cy.wait()

////////////////////////////////////////////////////////////

//cy.contains("Usersname").click() 
//cy.get("dat-cy=username").click()
//using {data-cy=username} attribute BEST PRACTICE


