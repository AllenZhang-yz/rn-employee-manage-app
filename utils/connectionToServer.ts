import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://258d22ba2dfd.ngrok.io',
});

export default instance;
