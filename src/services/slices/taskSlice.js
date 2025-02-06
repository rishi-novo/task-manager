import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axiosInstance.get('/tasks/');
    return response.data;
});

// Create a new task
export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
    const response = await axiosInstance.post('/tasks/', taskData);
    return response.data; // Return the created task
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.push(action.payload); // Add the new task to the state
            });
    },
});

export default taskSlice.reducer;