import axios from 'axios';

const appApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 15000,
});

export default appApi;
