import axios from 'axios';

const axiosInstance2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    'Content-Type': 'application/json'
  },
 
});

export default axiosInstance2;

