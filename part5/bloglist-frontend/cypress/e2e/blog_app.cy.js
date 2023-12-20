describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Steph Curry',
      username: 'chef',
      password: 'pikmin'
    }
    const newUser = {
      name: 'New User',
      username: 'newUser',
      password: 'test123'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', newUser)
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

    it('A blog can be deleted by the user who created it', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#author').type('blog author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()
      cy.reload()
      cy.contains('view').click()
      cy.contains('delete').click()
    })

    it('User can create a blog and only the creator can see/delete it', function() {
      // beforeEach logs in as 'chef', let's create a blog
      cy.contains('create new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#author').type('blog author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()
      cy.contains('blog title by blog author added')

      // Logout as 'chef'
      cy.contains('logout').click()

      // Login as 'newUser'
      cy.get('#username').type('newUser')
      cy.get('#password').type('test123')
      cy.get('#login-button').click()

      // Find the blog created by 'chef' and verify the delete button isn't visible
      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog with most likes')
      cy.get('#author').type('Author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()

      cy.contains('create new blog').click()
      cy.get('#title').type('Blog with fewer likes')
      cy.get('#author').type('Author')
      cy.get('#url').type('https://blog.com')
      cy.get('#createButton').click()

      // Click "view" for the blog with most likes
      cy.contains('Blog with most likes').parent().find('button').contains('view').click()

      // Click the "like" button for the blog with most likes
      cy.contains('likes 0').parent().find('button').contains('like').click()

      // Assert the order after the like
      cy.get('.blog').eq(0).should('contain', 'Blog with most likes')
      cy.get('.blog').eq(1).should('contain', 'Blog with fewer likes')
    })
  })
})
