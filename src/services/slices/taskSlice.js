import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Fetch all tasks
export const fetchAllTasks = createAsyncThunk('tasks/fetchAllTasks', async () => {
    const response = await axiosInstance.get('/get-all-tasks');
    return response.data;
});

// Fetch task by ID
export const fetchTaskById = createAsyncThunk(
    'tasks/fetchTaskById',
    async (taskId) => {
        const response = await axiosInstance.get(`/tasks/id?id=${taskId}`);
        return response.data;
    }
);

// Update task
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (taskData) => {
        const response = await axiosInstance.put('/tasks/id/', taskData);
        return response.data;
    }
);

// Change task priority
export const changeTaskPriority = createAsyncThunk(
    'tasks/changeTaskPriority',
    async ({ task_id, priority }) => {
        const response = await axiosInstance.post('/task/change-priority', {
            task_id,
            priority
        });
        return response.data;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        allTasks: [],
        taskDetails: {},
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all tasks
            .addCase(fetchAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.allTasks = action.payload.all_tasks;
                state.loading = false;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch task by ID
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.taskDetails[action.payload.task.id] = action.payload.task;
            })
            // Update task
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload.task;
                state.taskDetails[updatedTask.id] = updatedTask;
                state.allTasks = state.allTasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            })
            // Change priority
            .addCase(changeTaskPriority.fulfilled, (state, action) => {
                const updatedTask = action.payload.task;
                state.taskDetails[updatedTask.id] = updatedTask;
                state.allTasks = state.allTasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            });
    }
});

export default taskSlice.reducer;