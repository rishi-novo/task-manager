import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Fetch assignees by task ID
export const fetchAssigneesByTaskId = createAsyncThunk(
    'assignees/fetchByTaskId',
    async (taskId) => {
        const response = await axiosInstance.get(`/assignee/task_id?task_id=${taskId}`);
        return { taskId, assignees: response.data.data };
    }
);

// Fetch tasks by user ID
export const fetchTasksByUserId = createAsyncThunk(
    'assignees/fetchTasksByUserId',
    async (userId) => {
        const response = await axiosInstance.get(`/task/user_id?user_id=${userId}`);
        return response.data;
    }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
    'assignees/fetchUserById',
    async (userId) => {
        const response = await axiosInstance.get(`/users/id?id=${userId}`);
        return response.data;
    }
);

const assigneeSlice = createSlice({
    name: 'assignees',
    initialState: {
        taskAssignees: {}, // Keyed by task_id
        userTasks: {}, // Keyed by user_id
        users: {}, // Keyed by user_id
        loading: {}, // Track loading state per taskId
        error: {} // Track errors per taskId
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchAssigneesByTaskId states
            .addCase(fetchAssigneesByTaskId.pending, (state, action) => {
                state.loading[action.meta.arg] = true;
                state.error[action.meta.arg] = null;
            })
            .addCase(fetchAssigneesByTaskId.fulfilled, (state, action) => {
                state.loading[action.meta.arg] = false;
                state.taskAssignees[action.payload.taskId] = action.payload.assignees;
                state.error[action.meta.arg] = null;
            })
            .addCase(fetchAssigneesByTaskId.rejected, (state, action) => {
                state.loading[action.meta.arg] = false;
                state.error[action.meta.arg] = action.error.message;
            })
            .addCase(fetchTasksByUserId.fulfilled, (state, action) => {
                state.userTasks[action.meta.arg] = action.payload.data;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.users[action.payload.user.uuid] = action.payload.user;
            });
    }
});

export default assigneeSlice.reducer; 