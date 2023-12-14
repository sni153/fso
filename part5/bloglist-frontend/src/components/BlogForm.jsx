const BlogForm = ({title, author, url, handleSubmit, setTitle, setAuthor, setUrl}) => (
  <>
  <h1>create new</h1>
  <form onSubmit={handleSubmit}>
    <div>
    <label>title:</label>
    <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      <label>author:</label>
      <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      <label>url:</label>
      <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>  
  </>
)

export default BlogForm