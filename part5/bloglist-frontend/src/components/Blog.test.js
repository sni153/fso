import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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
  const titleAuthor = screen.getByTestId('title-author')
  expect(titleAuthor).toHaveTextContent('Test Blog Test Author')

  // Check if blog-likes exists and its text content
  const blogLikes = screen.queryByTestId('blog-likes')
  expect(blogLikes).toBeInTheDocument()
  expect(blogLikes).toHaveTextContent('likes 10')

  // Check if blog details section is hidden by default
  const blogDetails = screen.queryByTestId('blog-details')
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
      onRemove={jest.fn()} // Mock onRemove handler
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
      onRemove={jest.fn()}
      onView={jest.fn()}
    />
  )

  // Get the view button and trigger a click event
  const button = screen.getByTestId('toggle-button')
  await userEvent.click(button)

  // Check if the blog's URL and number of likes are shown
  const blogUrl = screen.getByTestId('blog-url')
  const blogLikes = screen.getByTestId('blog-likes')

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


