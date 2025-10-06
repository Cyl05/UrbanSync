import { graphqlRequest } from '../helpers/graphql.js';
import testRunner from '../utils/test-runner.js';
import { TEST_USERS, CITIZEN_TO_DELETE } from '../fixtures/test-data.js';

async function testUsersPermissions() {
    console.log('\n=== Testing Users Permissions ===\n');

    // Test 1: Citizen can select only own user data
    try {
        const selectUsers = `
      query SelectUsers {
        users {
          id
          name
          email
          role
        }
      }
    `;

        const result = await graphqlRequest(selectUsers, {}, 'citizen', TEST_USERS.citizen1);

        const onlyOwnData = result.data?.users?.length === 1 &&
            result.data?.users[0]?.id === TEST_USERS.citizen1;

        testRunner.logTest(
            'Citizen can select only own user data',
            !result.errors && onlyOwnData,
            result.errors?.[0]?.message || 'Returned multiple users'
        );
    } catch (error) {
        testRunner.logTest('Citizen can select only own user data', false, error.message);
    }

    // Test 2: Official can select all users
    try {
        const selectUsers = `
      query SelectUsers {
        users {
          id
          name
          email
          role
        }
      }
    `;

        const result = await graphqlRequest(selectUsers, {}, 'official', TEST_USERS.official1);

        testRunner.logTest(
            'Official can select all users',
            !result.errors && Array.isArray(result.data?.users),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Official can select all users', false, error.message);
    }

    // Test 3: Citizen can update own profile
    try {
        const updateUser = `
      mutation UpdateUser($id: uuid!, $name: String!) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateUser,
            {
                id: TEST_USERS.citizen1,
                name: 'Updated Name',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen can update own profile',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can update own profile', false, error.message);
    }

    // Test 4: Citizen cannot update other's profile
    try {
        const updateUser = `
      mutation UpdateUser($id: uuid!, $name: String!) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateUser,
            {
                id: TEST_USERS.citizen2,
                name: 'Hacked Name',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot update other\'s profile',
            !result.data?.update_users_by_pk,
            'Should have been blocked'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot update other\'s profile', true);
    }

    // Test 5: Citizen can delete own account
    try {
        const deleteUser = `
      mutation DeleteUser($id: uuid!) {
        delete_users_by_pk(id: $id) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            deleteUser,
            { id: CITIZEN_TO_DELETE },
            'citizen',
            CITIZEN_TO_DELETE
        );

        testRunner.logTest(
            'Citizen can delete own account',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can delete own account', false, error.message);
    }
}

export { testUsersPermissions };