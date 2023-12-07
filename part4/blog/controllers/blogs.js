const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	const note = await Blog.findById(request.params.id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
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

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const { likes } = request.body
	const blogToUpdate = {
		likes: likes
	}
	const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
	response.status(200).json(updatedNote)
})

module.exports = blogsRouter