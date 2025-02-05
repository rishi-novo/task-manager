import { configureStore } from '@reduxjs/toolkit';
// Import your slices here
// import yourSlice from './slices/yourSlice';

const store = configureStore({
    reducer: {
        // Add your slices here
        // yourSlice: yourSlice,
    },
});

export default store;