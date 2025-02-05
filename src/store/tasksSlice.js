import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axiosInstance.get('/tasks/');
    return response.data.tasks_all; // Adjust based on your API response structure
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                return action.payload; // Update state with fetched tasks
            });
    },
});

export default tasksSlice.reducer; 