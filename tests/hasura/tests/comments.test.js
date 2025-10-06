import { graphqlRequest } from '../helpers/graphql.js';
import testRunner from '../utils/test-runner.js';
import {
    TEST_USERS,
    ISSUE_OWNED_BY_CITIZEN1,
    ISSUE_ASSIGNED_TO_OFFICIAL1,
    COMMENT_BY_CITIZEN1,
    COMMENT_BY_CITIZEN2,
} from '../fixtures/test-data.js';

async function testCommentsPermissions() {
    console.log('\n=== Testing Comments Permissions ===\n');

    // Test 1: Citizen can insert comment on own issue
    try {
        const insertComment = `
      mutation InsertComment($issueId: uuid!, $content: String!, $authorId: uuid!) {
        insert_comments_one(object: {
          issue_id: $issueId,
          content: $content,
          author_id: $authorId
        }) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            insertComment,
            {
                issueId: ISSUE_OWNED_BY_CITIZEN1,
                content: 'This is my comment',
                authorId: TEST_USERS.citizen1,
            },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen can insert comment on own issue',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can insert comment on own issue', false, error.message);
    }

    // Test 2: Official can insert comment on assigned issue
    try {
        const insertComment = `
      mutation InsertComment($issueId: uuid!, $content: String!, $authorId: uuid!, $public: Boolean) {
        insert_comments_one(object: {
          issue_id: $issueId,
          content: $content,
          author_id: $authorId,
          public: $public
        }) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            insertComment,
            {
                issueId: ISSUE_ASSIGNED_TO_OFFICIAL1,
                content: 'Official response',
                authorId: TEST_USERS.official1,
                public: true,
            },
            'official',
            TEST_USERS.official1
        );

        testRunner.logTest(
            'Official can insert comment on assigned issue',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Official can insert comment on assigned issue', false, error.message);
    }

    // Test 3: Citizen can select all comments
    try {
        const selectComments = `
      query SelectComments {
        comments {
          id
          content
          author_id
          public
        }
      }
    `;

        const result = await graphqlRequest(selectComments, {}, 'citizen', TEST_USERS.citizen1);

        testRunner.logTest(
            'Citizen can select all comments',
            !result.errors && Array.isArray(result.data?.comments),
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can select all comments', false, error.message);
    }

    // Test 4: Citizen can delete own comment
    try {
        const deleteComment = `
      mutation DeleteComment($id: uuid!) {
        delete_comments_by_pk(id: $id) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            deleteComment,
            { id: COMMENT_BY_CITIZEN1 },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen can delete own comment',
            !result.errors,
            result.errors?.[0]?.message
        );
    } catch (error) {
        testRunner.logTest('Citizen can delete own comment', false, error.message);
    }

    // Test 5: Citizen cannot delete other's comment
    try {
        const deleteComment = `
      mutation DeleteComment($id: uuid!) {
        delete_comments_by_pk(id: $id) {
          id
        }
      }
    `;

        const result = await graphqlRequest(
            deleteComment,
            { id: COMMENT_BY_CITIZEN2 },
            'citizen',
            TEST_USERS.citizen1
        );

        testRunner.logTest(
            'Citizen cannot delete other\'s comment',
            !result.data?.delete_comments_by_pk,
            'Should have been blocked'
        );
    } catch (error) {
        testRunner.logTest('Citizen cannot delete other\'s comment', true);
    }
}

export { testCommentsPermissions };