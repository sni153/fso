const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan('tiny'))

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

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get("/info", (req, res) => {
  let numberOfContacts = contacts.length;
  let date = new Date();
  res.send(
    `Phonebook has info for ${numberOfContacts} people <br></br>${date}`
  );
});

app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);
  let entry = contacts.find((contact) => contact.id === id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 99999);

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

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  contacts = contacts.concat(contact);
  res.json(contact);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
