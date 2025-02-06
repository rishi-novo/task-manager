import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk('user/login', async (userData, { dispatch }) => {
    const response = await axiosInstance.post('/user/login', userData);
    const { user_data } = response.data;

    // Store user data and token in local storage
    localStorage.setItem('user_data', JSON.stringify(user_data));
    localStorage.setItem('auth_token', user_data.token);

    // Redirect to home page
    dispatch(redirectToHome());

    return user_data; // Return user data for further use if needed
});

export const registerUser = createAsyncThunk('user/register', async (userData) => {
    const response = await axiosInstance.post('/user/register/', userData);
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        redirectToHome: () => {
            // something we can change later
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                // Handle successful login
                return action.payload; // Store user data in state if needed
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                // Handle successful registration
            });
    },
});

export const { redirectToHome } = userSlice.actions;

export default userSlice.reducer;