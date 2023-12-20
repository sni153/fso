import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

// Test to check if blog title, author, and likes render by default
test('renders blog title, author, and likes by default', () => {
  // Initial blog data
  const initialBlog = {
    id: '1111',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      id: '2222',
    },
  }

  // User data
  const user = {
    username: 'testuser',
    name: 'Test User',
    id: '456',
  }

  // Render the Blog component
  render(<Blog blog={initialBlog} user={user} />)

  // Check if title and author are present
  const titleAuthor = screen.getByTestId('titleAuthor')
  expect(titleAuthor).toHaveTextContent('Test Blog Test Author')

  // Check if blogLikes exists and its text content
  const blogLikes = screen.queryByTestId('blogLikes')
  expect(blogLikes).toBeInTheDocument()
  expect(blogLikes).toHaveTextContent('likes 10')

  // Check if blog details section is hidden by default
  const blogDetails = screen.queryByTestId('blogDetails')
  expect(blogDetails).toHaveStyle({ display: 'none' }) // Check if it's hidden by default
})

// Test to check if clicking the view button calls the onView event handler once
test('clicking the view button calls event handler once', async () => {
  // Initial blog data
  const initialBlog = {
    id: '1111',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      id: '2222',
    },
  }

  // Logged-in user data
  const loggedInUser = {
    username: 'testuser',
    name: 'Test User',
    id: '456',
  }

  // Mock event handler for onView
  const mockOnViewHandler = jest.fn()

  // Render the Blog component with necessary props and event handlers
  render(
    <Blog
      blog={initialBlog}
      user={loggedInUser}
      onLike={jest.fn()} // Mock onLike handler
      onDelete={jest.fn()} // Mock onDelete handler
      onView={mockOnViewHandler} // Pass the mock handler for onView
    />
  )

  // Get the view button and trigger a click event
  const button = screen.getByTestId('toggle-button')
  await userEvent.click(button)

  // Check if the onView event handler has been called
  expect(mockOnViewHandler).toHaveBeenCalled()
})

// Test to check if blog details (URL and likes) are shown on button click
test('blog details (URL and likes) are shown when the button controlling the details is clicked', async () => {
  // Initial blog data
  const initialBlog = {
    id: '1111',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      id: '2222',
    },
  }

  // Logged-in user data
  const loggedInUser = {
    username: 'testuser',
    name: 'Test User',
    id: '456',
  }

  // Render the Blog component
  render(
    <Blog
      blog={initialBlog}
      user={loggedInUser}
      onLike={jest.fn()}
      onDelete={jest.fn()}
      onView={jest.fn()}
    />
  )

  // Get the view button and trigger a click event
  const button = screen.getByTestId('toggle-button')
  await userEvent.click(button)

  // Check if the blog's URL and number of likes are shown
  const blogUrl = screen.getByTestId('blogUrl')
  const blogLikes = screen.getByTestId('blogLikes')

  expect(blogUrl).toBeInTheDocument()
  expect(blogLikes).toBeInTheDocument()
})

// Test to check if the like button click triggers event handler twice
test('like button click calls event handler twice', async () => {
  // Initial blog data
  const initialBlog = {
    id: '1111',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      id: '2222',
    },
  }

  // Logged-in user data
  const loggedInUser = {
    username: 'testuser',
    name: 'Test User',
    id: '456',
  }

  // Mock event handler for onLike
  const mockOnLikeHandler = jest.fn()

  // Render the Blog component with necessary props and event handlers
  render(
    <Blog
      blog={initialBlog}
      user={loggedInUser}
      onLike={mockOnLikeHandler} // Pass the mock handler for onLike
    />
  )

  // Get the like button and trigger a click event twice
  const likeButton = screen.getByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  // Check if the onLike event handler has been called twice
  expect(mockOnLikeHandler).toHaveBeenCalledTimes(2)
})

test('form calls handleSubmit with correct details when creating a new blog', async () => {
  const user = userEvent.setup()
  const handleCreateBlog = jest.fn()

  render(<BlogForm onCreateBlog={handleCreateBlog} />)

  const inputValues = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://testurl.com',
  }

  const inputTitle = screen.getByPlaceholderText('Enter title...')
  const inputAuthor = screen.getByPlaceholderText('Enter author...')
  const inputUrl = screen.getByPlaceholderText('Enter URL...')
  const createButton = screen.getByText('create')

  await user.type(inputTitle, inputValues.title)
  await user.type(inputAuthor, inputValues.author)
  await user.type(inputUrl, inputValues.url)
  await user.click(createButton)

  expect(handleCreateBlog).toHaveBeenCalledTimes(1)
  expect(handleCreateBlog.mock.calls[0][0].title).toBe(inputValues.title)
  expect(handleCreateBlog.mock.calls[0][0].author).toBe(inputValues.author)
  expect(handleCreateBlog.mock.calls[0][0].url).toBe(inputValues.url)
})