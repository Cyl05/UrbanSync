import { graphqlRequest } from '../helpers/graphql.js';
import testRunner from '../utils/test-runner.js';
import {
    TEST_USERS,
    ISSUE_OWNED_BY_CITIZEN1,
    ISSUE_OWNED_BY_CITIZEN2,
    ATTACHMENT_BY_CITIZEN1,
    ATTACHMENT_BY_CITIZEN2,
    ATTACHMENT_TO_DELETE,
} from '../fixtures/test-data.js';

async function testAttachmentsPermissions() {
    console.log('\n=== Testing Attachments Permissions ===\n');

    // Test 1: Citizen cannot insert attachment for other's issue
    try {
        const insertAttachment = `
      mutation InsertAttachment($issueId: uuid!, $url: String!, $uploadedBy: uuid!) {
        insert_attachments_one(object: {
          issue_id: $issueId,
          url: $url,
          uploaded_by: $uploadedBy
        }) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            insertAttachment,
            {
                issueId: ISSUE_OWNED_BY_CITIZEN2,
                url: 'https://example.com/photo.jpg',
                uploadedBy: TEST_USERS.citizen1,
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot insert attachment for other\'s issue',
            !!result.errors,
            'Should have been blocked by permissions'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot insert attachment for other\'s issue', true);
    }

    // Test 3: Citizen can select all attachments
    try {
        const selectAttachments = `
      query SelectAttachments {
        attachments {
          id
          url
          uploaded_by
        }
      }
    `;

        const result = await graphqlRequest(selectAttachments, {}, 'citizen', TEST_USERS.citizen1);

        testRunner.logTest(
            'Citizen can select all attachments',
            !result.errors && Array.isArray(result.data?.attachments),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can select all attachments', false, error.message);
    }


    // Test 4: Citizen cannot update other's attachment
    try {
        const updateAttachment = `
      mutation UpdateAttachment($id: uuid!, $url: String!) {
        update_attachments_by_pk(pk_columns: {id: $id}, _set: {url: $url}) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            updateAttachment,
            {
                id: ATTACHMENT_BY_CITIZEN2,
                url: 'https://example.com/hacked.jpg',
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot update other\'s attachment',
            !result.data?.update_attachments_by_pk,
            'Should have been blocked'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot update other\'s attachment', true);
    }

    // Test 5: Official can select attachments
    try {
        const selectAttachments = `
      query SelectAttachments {
        attachments {
          id
          url
        }
      }
    `;

        const result = await graphqlRequest(selectAttachments, {}, 'official', TEST_USERS.official1);

        testRunner.logTest(
            'Official can select attachments',
            !result.errors && Array.isArray(result.data?.attachments),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Official can select attachments', false, error.message);
    }
}

export { testAttachmentsPermissions };