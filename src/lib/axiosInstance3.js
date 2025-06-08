import axios from 'axios';

const axiosInstance3 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.147:3000",
  headers: {
    'Content-Type': 'application/json'
  },
 
});

export default axiosInstance3;

