import axios from 'axios';

const BASE_URL = 'https://cc1fbde45ead-in-south-01.backstract.io/adoring-kalam-7a643470e47e11ef87cf0242ac18000555/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    // },
});

// Optional: Add a request interceptor to log requests
axiosInstance.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
});

export default axiosInstance; 