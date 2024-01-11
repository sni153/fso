import axios from "axios";
const baseUrl = "/api/users"; // replace with your actual API endpoint for users

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

export default { setToken, getAll };