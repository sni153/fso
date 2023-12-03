require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

// Enable Cross-Origin Resource Sharing (CORS)
// Middleware to allow cross-origin requests for all routes.
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'dist' directory
// Middleware to host static content from the 'dist' folder.
app.use(express.static("dist"));

// Morgan middleware to log HTTP requests in "tiny" format
app.use(morgan("tiny"));

// Define a custom token named "post-data" to access request body
morgan.token("post-data", (req, res) => JSON.stringify(req.body));

// Morgan middleware with custom format including request body
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
);

// Ignore the favicon.ico request by adding a middleware function
// that intercepts the request and responds with a 204 status code.
app.use("/favicon.ico", (req, res, next) => {
  return res.status(204).end();
});

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Define a route for the "/api/persons" path
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// app.get("/api/persons", (req, res) => {
//   res.json(contacts);
// });

app.get("/info", (req, res) => {
  let numberOfContacts = contacts.length;
  let date = new Date();
  res.send(
    `Phonebook has info for ${numberOfContacts} people <br></br>${date}`
  );
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// app.delete("/api/persons/:id", (req, res) => {
//   let id = Number(req.params.id);
//   contacts = contacts.filter((contact) => contact.id !== id);
//   res.status(204).end();
// });

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const names = contacts.map((contact) => contact.name.toLowerCase());
  const body = req.body;
  const name = body.name.toLowerCase();
  const number = body.number;

  if (!name && !number) {
    return res.status(400).json({ error: "name and number are missing" });
  }
  if (!name) {
    return res.status(400).json({ error: "name missing" });
  }
  if (!number) {
    return res.status(400).json({ error: "number missing" });
  }
  if (names.includes(name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const contact = new Person({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
