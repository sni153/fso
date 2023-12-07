const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})
	const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

test('dummy returns one', () => {
	const blogs = []
	const result = listHelper.dummy(blogs)
	expect(result).toBe(1)
})

describe('total likes', () => {
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

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(helper.initialBlogs)
		expect(result).toBe(43)
	})
})

describe('most likes', () => {
	test('of a bigger list of blogs', () => {
		const result = listHelper.favoriteBlog(helper.initialBlogs)
		expect(result).toEqual({
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12
		})
	})

	test('returns the correct amount of blog posts', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})
})

test('unique identifier of a blog post is named id', async () => {
	const response = await api.get('/api/blogs')
	const firstBlog = response.body[0]
	expect(firstBlog.id).toBeDefined()
})

test('successfully creates a new blog post', async () => {
	const newBlog = {
		title: 'blog title',
		author: 'blog author',
		url: 'www.blog.com',
		likes: 8,
	}
	const initialBlogs = await helper.initialBlogs
	// Make the POST request and capture the response
	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	// Retrieve all blogs from the database after addition
	const blogsFromDB = await helper.blogsInDb()
	const blogTitles = blogsFromDB.map(blog => blog.title)

	// Verify that the returned blog ID is in the list of IDs from the database
	expect(blogTitles).toContain(newBlog.title)

	// Verify that the total number of blogs increased by one
	const blogsAfterAddition = blogsFromDB
	expect(blogsAfterAddition).toHaveLength(initialBlogs.length + 1)
})

test('missing likes property defaults to 0', async () => {
	const newBlog = {
		title: 'Sample Title',
		author: 'Sample Author',
		url: 'https://sampleurl.com'
	}

	// Send the new blog to the server
	await api.post('/api/blogs').send(newBlog).expect(201)

	// Fetch all blogs after creation
	const blogsInDb = await Blog.find({})
	const addedBlog = blogsInDb.find(blog => blog.title === newBlog.title)

	expect(addedBlog.likes).toBe(0)
})

afterAll(async () => {
	await mongoose.connection.close()
})