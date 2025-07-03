const axios = require('axios');

// Replace this URL with your actual user API
const API_BASE = 'http://192.168.9.5:3000/api/users';

const getUserByEmail = async (email) => {
  const res = await axios.get(API_BASE);
  return res.data.find(user => user.email === email);
};

const updateUserPassword = async (userId, password) => {
  return axios.patch(`${API_BASE}/${userId}`, { password });
};

module.exports = { getUserByEmail, updateUserPassword };
