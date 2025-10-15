import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/schema';

interface UserState {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.error = null;
        },
        clearUser: (state) => {
            state.currentUser = null;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        fetchUserRequest: (state, _action: PayloadAction<string>) => {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        fetchUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { 
    setUser, 
    clearUser, 
    setError,
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
