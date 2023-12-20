describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Steph Curry',
      username: 'chef',
      password: 'pikmin'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('chef')
      cy.get('#password').type('pikmin')
      cy.get('#login-button').click()

      cy.contains('Steph Curry logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('chef')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('chef')
      cy.get('#password').type('pikmin')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#author').type('blog author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()
      cy.contains('blog title by blog author added')
    })

    it('A blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#author').type('blog author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()
      cy.contains('blog title by blog author added')
      cy.contains('view').click()
      cy.get('.likeButton').click()
      cy.contains('likes 1')
    })
  })
})
