import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data.comments;
};

export default { getAll };