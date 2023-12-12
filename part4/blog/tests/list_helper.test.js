const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const _ = require('lodash')

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
})

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return 0
	}

	const authorCount = _.countBy(blogs, 'author') // Count occurrences of each author
	const maxAuthor = _.maxBy(_.keys(authorCount), (author) => authorCount[author]) // Find author with maximum count

	return {
		author: maxAuthor,
		blogs: authorCount[maxAuthor]
	}
}

describe('Most Blogs Calculation', () => {
	test('returns zero blogs for an empty list', () => {
		const result = mostBlogs([])
		expect(result).toBe(0)
	})

	test('returns the author and blog count for a single blog list', () => {
		const singleBlogList = [
			{
				author: 'Edsger W. Dijkstra',
				blogs: 1,
			}
		]
		const result = mostBlogs(singleBlogList)
		expect(result).toMatchObject({
			author: 'Edsger W. Dijkstra',
			blogs: 1,
		})
	})

	test('identifies the author with the most blogs in a larger list', () => {
		const largerBlogList = helper.initialBlogs
		const topAuthorInfo = mostBlogs(largerBlogList)
		expect(topAuthorInfo).toMatchObject({
			author: 'Robert C. Martin',
			blogs: 3, 
		})
	})
})
