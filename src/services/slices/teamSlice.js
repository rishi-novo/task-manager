import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createTeam = createAsyncThunk('team/createTeam', async (teamData) => {
    const response = await axiosInstance.post('team', teamData);
    return response.data;
});

const teamSlice = createSlice({
    name: 'team',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTeam.fulfilled, (state, action) => {
                state.push(action.payload);
            });
    },
});

export default teamSlice.reducer; 