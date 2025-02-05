import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk('user/login', async (userData) => {
    const response = await axiosInstance.post('/user/login/', userData);
    return response.data;
});

export const registerUser = createAsyncThunk('user/register', async (userData) => {
    const response = await axiosInstance.post('/user/register/', userData);
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                // Handle successful login
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                // Handle successful registration
            });
    },
});

export default userSlice.reducer; 