// axiosInstance.js
import axios from 'axios';
import { getAccessToken, refresh_Token } from './authService';

const axiosInstance = axios.create({
    // baseURL: 'http://192.168.0.113:9000',
    baseURL: 'http://192.168.1.12:3000',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors and refresh the token
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`${response.config.url}`, response.config.data || "");
        if (response.data) {
            try {
                return response
                // Decode Base64 data
                //const decodedData = atob(response.data);
                //response.data = JSON.parse(decodedData); // Replace with decoded data
                console.log("Response => ", response.data);
            } catch (error) {
                console.error("Error decoding Base64 response:", error.message);
            }
        }
        return response;
        //return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refresh_Token();
                const newAccessToken = getAccessToken();
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
