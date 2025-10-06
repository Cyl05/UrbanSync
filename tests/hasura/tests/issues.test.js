import { graphqlRequest } from '../helpers/graphql.js';
import testRunner from '../utils/test-runner.js';
import {
    TEST_USERS,
    ISSUE_OWNED_BY_CITIZEN1,
    ISSUE_OWNED_BY_CITIZEN2,
    SAMPLE_LOCATION,
    TEST_DEPARTMENT,
} from '../fixtures/test-data.js';

async function testIssuesPermissions() {
    console.log('\n=== Testing Issues Permissions ===\n');

    // Test 1: Citizen can insert issue
    try {
        const insertIssue = `
      mutation InsertIssue($title: String!, $description: String!, $createdBy: uuid!, $latitude: numeric!, $longitude: numeric!) {
        insert_issues_one(object: {
          title: $title,
          description: $description,
          created_by: $createdBy,
          latitude: $latitude,
          longitude: $longitude,
          status: "pending"
        }) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            insertIssue,
            {
                title: 'Pothole on Main Street',
                description: 'Large pothole needs repair',
                createdBy: TEST_USERS.citizen1,
                ...SAMPLE_LOCATION,
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen can insert issue',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can insert issue', false, error.message);
    }

    // Test 2: Citizen can select all issues
    try {
        const selectIssues = `
      query SelectIssues {
        issues {
          id
          title
          description
          status
          created_by
          assigned_official
        }
      }
    `;

        const result = await graphqlRequest(selectIssues, {}, 'citizen', TEST_USERS.citizen1);

        testRunner.logTest(
            'Citizen can select all issues',
            !result.errors && Array.isArray(result.data?.issues),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can select all issues', false, error.message);
    }

    // Test 3: Citizen can update own issue
    try {
        const updateIssue = `
      mutation UpdateIssue($id: uuid!, $description: String!) {
        update_issues_by_pk(pk_columns: {id: $id}, _set: {description: $description}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateIssue,
            {
                id: ISSUE_OWNED_BY_CITIZEN1,
                description: 'Updated description',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen can update own issue',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can update own issue', false, error.message);
    }

    // Test 4: Citizen cannot update issue status
    try {
        const updateIssue = `
      mutation UpdateIssue($id: uuid!, $status: String!) {
        update_issues_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateIssue,
            {
                id: ISSUE_OWNED_BY_CITIZEN1,
                status: 'resolved',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot update issue status',
            !!result.errors || !result.data?.update_issues_by_pk,
            'Should be blocked from updating status'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot update issue status', true);
    }

    // Test 5: Official can update issue status and department
    try {
        const updateIssue = `
      mutation UpdateIssue($id: uuid!, $status: String!, $departmentId: uuid!) {
        update_issues_by_pk(pk_columns: {id: $id}, _set: {
          status: $status,
          assigned_department: $departmentId
        }) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateIssue,
            {
                id: ISSUE_OWNED_BY_CITIZEN1,
                status: 'in_progress',
                departmentId: TEST_DEPARTMENT,
            },
            'official',
            TEST_USERS.official1
        );

        testRunner.logTest(
            'Official can update issue status and department',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Official can update issue status and department', false, error.message);
    }

    // Test 6: Citizen cannot update other's issue
    try {
        const updateIssue = `
      mutation UpdateIssue($id: uuid!, $description: String!) {
        update_issues_by_pk(pk_columns: {id: $id}, _set: {description: $description}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateIssue,
            {
                id: ISSUE_OWNED_BY_CITIZEN2,
                description: 'Hacked description',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot update other\'s issue',
            !result.data?.update_issues_by_pk,
            'Should have been blocked'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot update other\'s issue', true);
    }
}

export { testIssuesPermissions };