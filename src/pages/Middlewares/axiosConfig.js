import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/", // Your Django API base URL
});

// Response Interceptor for Decoding
apiClient.interceptors.response.use(
    (response) => {
        if (response.data) {
            try {
                return response;
      //          const decodedData = atob(response.data);
           //    response.data =response.data //JSON.parse(); // Replace with decoded data
            } catch (error) {
                console.error("Error decoding Base64 response:", error.message);
            }
        }
        return response;
    },
    (error) => {
        // Handle errors globally
        return Promise.reject(error);
    }
);

export default apiClient;
