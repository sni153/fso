require('dotenv').config()

// Import the express module and create an express application
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require('./models/note')

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// Array of notes
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Define a route for the root path ("/")
app.get("/", (request, response) => {
  // Send a response with the string "Hello World!"
  response.send("<h1>Hello World!</h1>");
  // Express automatically sets the Content-Type header to "text/html" for the response.
});

// Define a route for the "/api/notes" path
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// app.get("/api/notes/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const note = notes.find((note) => note.id === id);
//   if (note) {
//     response.json(note);
//   } else {
//     response.status(404).end();
//   }
// });

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

// app.post("/api/notes", (request, response) => {
//   const body = request.body;
//   if (!body.content) {
//     return response.status(400).json({
//       error: "content missing",
//     });
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     id: generateId(),
//   };

//   notes = notes.concat(note);

//   response.json(note);
// });

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;

// Start the server and listen for HTTP requests on port 3001
app.listen(PORT, () => {
  // Log a message indicating the server is running
  console.log(`Server running on port ${PORT}`);
});
