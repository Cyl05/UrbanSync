import { graphqlRequest } from '../helpers/graphql.js';
import testRunner from '../utils/test-runner.js';
import { TEST_USERS } from '../fixtures/test-data.js';

async function testDepartmentsPermissions() {
    console.log('\n=== Testing Departments Permissions ===\n');

    // Test 1: Official can select departments
    try {
        const selectDepartments = `
      query SelectDepartments {
        departments {
          id
          name
          description
        }
      }
    `;

        const result = await graphqlRequest(selectDepartments, {}, 'official', TEST_USERS.official1);

        testRunner.logTest(
            'Official can select departments',
            !result.errors && Array.isArray(result.data?.departments),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Official can select departments', false, error.message);
    }

    // Test 2: Citizen cannot select departments
    try {
        const selectDepartments = `
      query SelectDepartments {
        departments {
          id
          name
        }
      }
    `;

        const result = await graphqlRequest(selectDepartments, {}, 'citizen', TEST_USERS.citizen1);

        testRunner.logTest(
            'Citizen cannot select departments',
            !!result.errors,
            'Should have been blocked'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot select departments', true);
    }
}

export { testDepartmentsPermissions };