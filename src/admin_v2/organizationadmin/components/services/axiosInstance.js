import axios from 'axios';

const baseURL = 'https://learnhub.constantsys.com';
// const baseURL = 'http://127.0.0.1:8000'
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
    }
);

export default axiosInstance;
