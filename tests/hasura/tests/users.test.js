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

    // Test 3: Citizen cannot update other's profile
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
}

export { testUsersPermissions };