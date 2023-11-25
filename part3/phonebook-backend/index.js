const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
