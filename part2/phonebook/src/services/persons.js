import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => axios.get(baseUrl);

const create = (newPerson) => axios.post(baseUrl, newPerson);

const deleteContact = (person)=> axios.delete(`http://localhost:3001/persons/${person.id}`)

export default { getAll, create, deleteContact };
