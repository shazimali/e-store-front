import axios from 'axios';
// axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.baseURL = "https://apistore.aisoft360.com/api";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
