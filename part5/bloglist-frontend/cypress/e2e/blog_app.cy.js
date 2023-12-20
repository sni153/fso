describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:5173')
    cy.contains('login')
  })
})


