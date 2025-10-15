import { call, put, takeLatest } from 'redux-saga/effects';
import { gql } from '@apollo/client';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/schema';
import { createApolloClient } from '../lib/client';
import {
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
} from './userSlice';

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

function* fetchUserSaga(action: PayloadAction<string>) {
    try {
        const userId = action.payload;
        const client = createApolloClient();
        
        const { data }: { data: GetUserData } = yield call(
            [client, client.query],
            {
                query: GET_USER,
                variables: { id: userId },
            }
        );

        if (data?.users?.[0]) {
            yield put(fetchUserSuccess(data.users[0]));
        } else {
            yield put(fetchUserFailure('User not found'));
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
        yield put(fetchUserFailure(errorMessage));
    }
}

export function* watchFetchUser() {
    yield takeLatest(fetchUserRequest.type, fetchUserSaga);
}

export default function* userSaga() {
    yield watchFetchUser();
}
