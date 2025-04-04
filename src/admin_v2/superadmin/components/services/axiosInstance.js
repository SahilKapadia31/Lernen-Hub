import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://learnhub.constantsys.com',
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
