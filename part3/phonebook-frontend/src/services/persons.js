import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAllContacts = () => axios.get(baseUrl);

const createContact = (newContact) => axios.post(baseUrl, newContact);

const deleteContact = (contact) => axios.delete(`${baseUrl}/${contact.id}`);

const updateContact = (contactId, updatedContact) => {
  const request = axios.put(`${baseUrl}/${contactId}`, updatedContact);
  return request.then((response) => response.data);
};

export default { getAllContacts, createContact, deleteContact, updateContact };
