// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
	return total
}

const favoriteBlog = (blogs) => {
	const mostLikedBlog = blogs.reduce((prevBlog, currentBlog) => {
		return (prevBlog.likes > currentBlog.likes) ? prevBlog : currentBlog
	}, blogs[0])
	const { title, author, likes } = mostLikedBlog
	return { title, author, likes }
}

module.exports = { dummy, totalLikes, favoriteBlog }