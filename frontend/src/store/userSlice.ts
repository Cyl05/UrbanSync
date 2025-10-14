import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import type { User } from '../types/schema';
import { createApolloClient } from '../lib/client';

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

const GET_USER = gql`
  query getUser($id: uuid!) {
    users(where: {id: {_eq: $id}}) {
      id
      email
      name
      role
      created_at
      department {
        id
        name
        description
      }
      profile_picture
    }
  }
`;

type GetUserData = {
    users: User[];
};

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const client = createApolloClient();
            const { data } = await client.query<GetUserData>({
                query: GET_USER,
                variables: { id: userId },
            });

            if (data?.users?.[0]) {
                return data.users[0] as User;
            } else {
                return rejectWithValue('User not found');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
            return rejectWithValue(errorMessage);
        }
    }
);

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, clearUser, setError } = userSlice.actions;
export default userSlice.reducer;
