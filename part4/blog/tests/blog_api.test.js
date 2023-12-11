const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const createUser = async () => {
	try {
		await User.deleteMany({})
		const newUser = {
			username: 'jessepinkman',
			password: 'science',
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(201)

		return response.body
	} catch (error) {
		console.error('Error creating user:', error)
		return null
	}
}

const getToken = async () => {
	const user = {
		username: 'jessepinkman',
		password: 'science',
	}
	const response = await api
		.post('/api/login')
		.send(user)
	return response.body.token
}

const createBlog = async (blog, userToken) => {
	return api
		.post('/api/blogs')
		.set('Authorization',`Bearer ${userToken}`)
		.send(blog)
}

const blogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5
	},
	{
		title: 'Don’t Just LeetCode; Follow the Coding Patterns Instead',
		author: 'Arslan Ahmad',
		url: 'https://medium.com/gitconnected/dont-just-leetcode-follow-the-coding-patterns-instead-4beb6a197fdb',
		likes: 2
	}
]

describe('Functionality related to Blogs including:', () => {
	let userToken
	let savedBlogs
	let testUser

	beforeAll(async () => {
		await Blog.deleteMany({})
		testUser = await createUser()

		userToken = await getToken()
		// Create blogs using createBlog function
		const createBlogPromises = blogs.map(async blog => {
			await createBlog(blog, userToken)
		})
		await Promise.all(createBlogPromises)

		// Fetch blogs from the database after creation
		const response = await api.get('/api/blogs')
		savedBlogs = response.body
	})

	describe('Authentication and Blog Posts:', () => {
		test('retrieve user token upon login', async () => {
			expect(userToken).toBeDefined()
			expect(typeof userToken).toBe('string')
		})
  
		// 4.8: Blog list tests, step1
		test('returns the correct amount of blog posts', async () => {
			expect(savedBlogs).toHaveLength(blogs.length)
		})
  
		// 4.9: Blog list tests, step2
		test('unique identifier of a blog post is named id', async () => {
			const response = await api.get('/api/blogs')
			const firstBlog = response.body[0]
			expect(firstBlog.id).toBeDefined()
		})
	})

	describe('Adding a Blog:', () => {
		// 4.10: Blog list tests, step3
		test('a valid blog can be added', async () => {
			const newBlog = {
				title: 'learn to write tests',
				author: 'blog author',
				url: 'www.blog.com',
				likes: 8,
			}

			await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${userToken}`)
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)
		})

		// 4.11*: Blog list tests, step4
		test('missing likes property defaults to 0', async () => {
			const newBlog = {
				title: 'Sample Title',
				author: 'Sample Author',
				url: 'https://sampleurl.com'
			}

			// Send the new blog to the server
			await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${userToken}`)
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			// Fetch all blogs after creation
			const response = await api.get('/api/blogs')
			const blogsInDb = response.body
			const addedBlog = blogsInDb.find(blog => blog.title === newBlog.title)
			expect(addedBlog.likes).toBe(0)
		})

		// 4.12*: Blog list tests, step5
		test('returns 400 Bad Request for Missing Title in Creating New Blogs', async () => {
			const newBlogMissingTitle = {
				author: 'blog author',
				url: 'www.blog.com',
				likes: 8,
			}
			await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${userToken}`)
				.send(newBlogMissingTitle)
				.expect(400)
				.expect('Content-Type', /application\/json/)
		})

		test('returns 400 Bad Request for Missing URL in Creating New Blogs', async () => {
			const newBlogMissingURL = {
				title: 'blog title',
				author: 'blog author',
				likes: 8,
			}
  
			// Send the new blog to the server
			await api
				.post('/api/blogs')
				.set('Authorization', `Bearer ${userToken}`)
				.send(newBlogMissingURL)
				.expect(400)
				.expect('Content-Type', /application\/json/)
		})
		// 4.23*: bloglist expansion, step11
		test('adding a blog fails with status code 401 if token is not provided', async () => {
			const newBlog = {
				title: 'Test Blog',
				author: 'Test Author',
				url: 'https://testblog.com',
				likes: 5,
			}
			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(401)
		})
	})
  
	// 4.13 Blog list expansions, step1
	describe('Deletion of a note', () => {
		test('succeeds with a 204 status code if id is valid', async () => {
			const response = await api.get('/api/blogs')
			const blogsAtStart = response.body
			const blogToDelete = blogsAtStart[0]
		
			await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.set('Authorization', `Bearer ${userToken}`)
				.expect(204)
		})
	})

	// 4.14 Blog list expansions, step2
	describe('Updating an individual blog post', () => {
		test(' updating an individual blog post succeeds with a 204 status code if id is valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToUpdate = blogsAtStart[0]
			const updatedLikes = 10 

			const response = await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send({ likes: updatedLikes })
				.expect(200)
			expect(response.body.likes).toBe(updatedLikes)
		})
	})
})

describe('Calculating total likes:', () => {
	const emptyList = []
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	test('of empty list is zero', () => {
		const result = listHelper.totalLikes(emptyList)
		expect(result).toBe(0)
	})

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})

	test('of a bigger list is calculated correctly', () => {
		const result = listHelper.totalLikes(helper.initialBlogs)
		expect(result).toBe(43)
	})
})

afterAll(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	await mongoose.connection.close()
})
