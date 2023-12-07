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
	// 4.8: Blog list tests, step1
	test('returns the correct amount of blog posts', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})
})

// 4.9: Blog list tests, step2
test('unique identifier of a blog post is named id', async () => {
	const response = await api.get('/api/blogs')
	const firstBlog = response.body[0]
	expect(firstBlog.id).toBeDefined()
})

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
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)
	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	const blogTitles = blogsAtEnd.map(b => b.title)
	expect(blogTitles).toContain('learn to write tests')
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
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	// Fetch all blogs after creation
	const blogsInDb = await helper.blogsInDb()
	const addedBlog = blogsInDb.find(blog => blog.title === newBlog.title)
	expect(addedBlog.likes).toBe(0)
})

// 4.12*: Blog list tests, step5
test('Returns 400 Bad Request for Missing Title in Creating New Blogs', async () => {
	const newBlogMissingTitle = {
		author: 'blog author',
		url: 'www.blog.com',
		likes: 8,
	}

	// Send the new blog to the server
	await api.post('/api/blogs').send(newBlogMissingTitle).expect(400)
})

test('Returns 400 Bad Request for Missing URL in Creating New Blogs', async () => {
	const newBlogMissingURL = {
		title: 'blog title',
		author: 'blog author',
		likes: 8,
	}

	// Send the new blog to the server
	await api.post('/api/blogs').send(newBlogMissingURL).expect(400)
})

describe('deletion of a note', () => {
	test('succeeds with a 204 status code if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]
		
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const blogTitles = blogsAtEnd.map(blog => blog.title)
		expect(blogTitles).not.toContain(blogToDelete.title)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})