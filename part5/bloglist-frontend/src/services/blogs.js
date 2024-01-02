import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }, // Attach the token to the headers
  };
  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error); // Throw error for handling
  }
};

const update = async (newObject, blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.put(`${baseUrl}/${blogId}`, newObject, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.delete(`${baseUrl}/${blogId}`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export default { setToken, getAll, create, update, deleteBlog };
