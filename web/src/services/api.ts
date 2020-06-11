import axios from 'axios';
// a biblioteca axios permite que façamos requisições ao backend

const api = axios.create({
    baseURL: 'http://localhost:3333/'
});

export default api;