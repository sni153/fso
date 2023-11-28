# Phonebook API

This project sets up a basic phonebook API using Node.js and Express framework.

## Description

The API provides functionalities to manage contacts in a phonebook. It includes endpoints for:

- Retrieving all contacts (`GET /api/persons`)
- Getting information about the phonebook (`GET /info`)
- Retrieving a specific contact by ID (`GET /api/persons/:id`)
- Deleting a contact by ID (`DELETE /api/persons/:id`)
- Adding a new contact (`POST /api/persons`)

## Online Application

[Click here to access the Phonebook API online](https://phonebook-backend-2023.fly.dev/api/persons)

## Endpoints

### Get All Contacts

- **GET** `/api/persons`
- Retrieves all contacts stored in the phonebook.

### Get Phonebook Info

- **GET** `/info`
- Provides information about the phonebook, including the number of contacts and the current date.

### Get Contact by ID

- **GET** `/api/persons/:id`
- Retrieves a specific contact by their ID.

### Delete Contact by ID

- **DELETE** `/api/persons/:id`
- Deletes a contact from the phonebook based on their ID.

### Add New Contact

- **POST** `/api/persons`
- Adds a new contact to the phonebook. Requires `name` and `number` fields in the request body. Checks for unique names before adding.

## Notes

- Contacts are stored in memory and reset upon server restart.
- Unique names are enforced when adding new contacts.
- Error handling is implemented for missing name, number, or duplicate name.
