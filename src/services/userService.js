import axiosInstance from '../lib/axiosInstance';

export const getUsers = async () => {
    const response = await axiosInstance.get('/users/');
    return response.data;
};

export const createUser = async (userData) => {
    // debugger
    const response = await axiosInstance.post('/users/', userData);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axiosInstance.get(`/users/id?id=${id}`);
    return response.data;
};

export const deleteUserById = async (id) => {
    const response = await axiosInstance.delete(`/users/id?id=${id}`);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axiosInstance.post('/user/login', loginData);
    return response.data;
}; 