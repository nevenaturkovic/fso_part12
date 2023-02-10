const baseUrl = 'http://localhost:5000'

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${baseUrl}/api/testing/reset`)
    const user = {
      name: "Cveta Cveklic",
      username: "cveklica123",
      password: "password",
    }
    cy.request("POST", `${baseUrl}/api/users/`, user)
    cy.visit(`${baseUrl}`)
  })

  it("front page can be opened", function () {
    cy.contains("log in to application")
  })

  it("Login form is shown", function () {
    cy.contains("log in to application")
    cy.contains("username")
    cy.contains("password")
    cy.contains("login")
  })

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click()
      cy.get("#username").type("cveklica123")
      cy.get("#password").type("password")
      cy.get("#login-button").click()

      cy.contains("Cveta Cveklic logged in")
    })

    it("fails with wrong credentials", function () {
      cy.contains("login").click()
      cy.get("#username").type("cveklica")
      cy.get("#password").type("pasword")
      cy.get("#login-button").click()

      cy.contains("wrong username or password")
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)")

      cy.get("html").should("not.contain", "Cveta Cveklic logged in")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      // log in user here
      cy.login({ username: "cveklica123", password: "password" })
    })

    it("A blog can be created", function () {
      cy.contains("create new blog").click()
      cy.get("#title").type("a blog created by cypress")
      cy.get("#author").type("cveta cveklic")
      cy.get("#url").type("www.cveklic.com")
      cy.get("#create-button").click()
      cy.contains("a blog created by cypress")
    })

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Decija pesmarica",
          author: "Zmaj",
          url: "www.google.com",
        })
      })

      it("a blog can be liked", function () {
        cy.get("#view-button").click()
        cy.get(".numberOfLikes").should("contain", "0")
        cy.get("#like-button").click()
        cy.get(".numberOfLikes").should("contain", "1")
      })

      it("user who didn't create a blog can't delete it", function () {
        cy.get("#logout-button").click()
        const anotherUser = {
          name: "Miska Misisc",
          username: "misica",
          password: "disneyland",
        }
        cy.request("POST", `${baseUrl}/api/users/`, anotherUser)
        cy.get("#username").type("misica")
        cy.get("#password").type("disneyland")
        cy.get("#login-button").click()

        cy.get("#view-button").click()
        cy.should("not.contain", "#remove-button")
      })
    })

    describe("having multiple blogs", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "The title with the second most likes",
          author: "second",
          url: "www.google.com",
          likes: 5,
        })
        cy.createBlog({
          title: "The title with the most likes",
          author: "best",
          url: "www.google.com",
          likes: 12,
        })
      })
      it("blogs are ordered according to likes with the blog with the most likes being first", function () {
        cy.get(".blog").eq(0).should("contain", "The title with the most likes")
        cy.get(".blog")
          .eq(1)
          .should("contain", "The title with the second most likes")
      })
    })
  })
})
