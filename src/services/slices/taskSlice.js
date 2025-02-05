import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axiosInstance.get('/tasks');
    return response.data;
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                return action.payload;
            });
    },
});

export default taskSlice.reducer; 