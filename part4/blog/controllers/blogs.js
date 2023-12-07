const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const { title, author, url, likes } = request.body
	if (!title || !url) {
		return response.status(400).json({ error: 'Title and url are required' })
	}
	const blog = new Blog({
		title: title,
		author: author,
		url: url,
		likes: likes === undefined ? 0 : likes,
	})
	const result = await blog.save()
	response.status(201).json(result)
})

module.exports = blogsRouter