import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice';
import teamReducer from './slices/teamSlice';
import assigneeReducer from './slices/assigneeSlice';

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        users: userReducer,
        teams: teamReducer,
        assignees: assigneeReducer,
    },
});

export default store;