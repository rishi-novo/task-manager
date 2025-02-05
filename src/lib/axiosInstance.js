import axios from 'axios';

const BASE_URL = 'https://cc1fbde45ead-in-south-01.backstract.io/pensive-mccarthy-6b7c9f8cde4411efbd780242ac12000431/api';

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