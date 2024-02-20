const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

let authorCount; // Variable to store the count of authors

// Define resolvers for the GraphQL schema
const resolvers = {
  // Resolvers for queries and mutations
Query: {
  bookCount: async () => await Book.countDocuments({}),
  authorCount: async () => {
    if (!authorCount) {
      authorCount = await Author.countDocuments({});
    }
    return authorCount;
  },
  allBooks: async (root, args) => {
    let query = {};

    if (args.author) {
      const author = await Author.findOne({ name: args.author })
      if (author) {
        query.author = author._id;
      }
    }

    if (args.genre) {
      query.genres = args.genre;
    }

    return await Book.find(query).populate('author')
  },
  allAuthors: async () => await Author.find({}),
  me: (root, args, context) => {
    return context.currentUser
  }
},
Author: {
  bookCount: async (root) => {
    return await Book.countDocuments({ author: root._id });
  }
},
Mutation: {
  addBook: async (root, args, context) => {
    const currentUser = context.currentUser
    if (!currentUser) {
      throw new GraphQLError('You must be logged in to add a book', {
        extensions: {
          code: 'UNAUTHENTICATED',
        }
      })
    }

    // Fetch all authors in a single request
    const authors = await Author.find({});

    // Find the author from the fetched authors
    let author = authors.find(author => author.name === args.author);

    // // Check if the author exists
    // let author = await Author.findOne({ name: args.author });
  
     // If the author doesn't exist, create a new author
  if (!author) {
    author = new Author({ name: args.author });
    try {
      await author.save();
    } catch (error) {
      if (error.message.includes('is shorter than the minimum allowed length (4)')) {
        throw new GraphQLError('Author name is too short. It should be at least 4 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          }
        });
      }
    }
  }
  
    try {
      // Create a new book with the author
      let book = new Book({ ...args, author: author._id });
  
      // Save the book and populate the author field
      book = await book.save();
      book = await Book.populate(book, { path: 'author' });

      // Increment the bookCount of the author
      author.bookCount += 1;
      await author.save();

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
  
      return book;
    } catch (error) {
      if (error.message.includes('is shorter than the minimum allowed length (5)')) {
        throw new GraphQLError('Book title is too short. It should be at least 5 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          }
        });
      } else if (error.message.includes('is shorter than the minimum allowed length (4)')) {
        throw new GraphQLError('Author name is too short. It should be at least 4 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          }
        });
      } else if (error.message.includes('Book validation failed: title: Error, expected `title` to be unique')) {
        throw new GraphQLError('Book title already exists. Please provide a unique title.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          }
        });
      } else {
        throw new GraphQLError('An unexpected error has occurred. Please try again later.', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            originalMessage: error.message,
            invalidArgs: args,
          }
        });
      }
    }
  },
  editAuthor: async (root, args, context) => {
    const currentUser = context.currentUser
    if (!currentUser) {
      throw new GraphQLError('You must be logged in to add a book', {
        extensions: {
          code: 'UNAUTHENTICATED',
        }
      })
    }
    const updatedAuthor = await Author.findOneAndUpdate(
      { name: args.name },
      { born: args.setBornTo },
      { new: true }
    )

    if (!updatedAuthor) {
      return null;
    }

    return updatedAuthor;
  },
  createUser: async (root, args) => {
    const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    try {
      await user.save()
      return user
    } catch (error) {
      throw new GraphQLError('Saving user failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
        }
      })
    }
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })
    if ( !user || args.password !== 'secret') {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    }
    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  }
  
},
Subscription: {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
  },
},
}

module.exports = resolvers; 