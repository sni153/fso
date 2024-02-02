// Import necessary modules
const { ApolloServer } = require('@apollo/server') // Apollo Server for creating GraphQL server
const { startStandaloneServer } = require('@apollo/server/standalone') // Standalone server for Apollo
const { GraphQLError } = require('graphql');

const mongoose = require('mongoose') // Mongoose for MongoDB interactions
mongoose.set('strictQuery', false) // Disable strict mode for queries
const Author = require('./models/author') // Import Author model
const Book = require('./models/book') // Import Book model
require('dotenv').config() // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI // Get MongoDB connection string from environment variables
console.log('connecting to', MONGODB_URI)

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

  // Mock data for authors
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky',
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', 
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

// Mock data for books
let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

// Define GraphQL schema
const typeDefs = `
  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
  }
`

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
    allAuthors: async () => await Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id });
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      // Check if the author exists
      let author = await Author.findOne({ name: args.author });
    
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
    editAuthor: async (root, args) => {
      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )

      if (!updatedAuthor) {
        return null;
      }

      return updatedAuthor;
    }
  }
}

// Create Apollo Server with the defined schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start the server on port 4000
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})