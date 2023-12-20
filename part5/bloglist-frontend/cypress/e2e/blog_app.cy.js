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
})
