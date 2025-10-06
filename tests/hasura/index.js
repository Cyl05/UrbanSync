import testRunner from './utils/test-runner.js';
import { testAttachmentsPermissions } from './tests/attachments.test.js';
import { testCommentsPermissions } from './tests/comments.test.js';
import { testIssuesPermissions } from './tests/issues.test.js';
import { testUsersPermissions } from './tests/users.test.js';
import { testDepartmentsPermissions } from './tests/departments.test.js';

async function runAllTests() {
	console.log('╔════════════════════════════════════════════════╗');
	console.log('║   Hasura Permissions Test Suite - UrbanSyncDB  ║');
	console.log('╚════════════════════════════════════════════════╝');

	try {
		await testAttachmentsPermissions();
		await testCommentsPermissions();
		await testIssuesPermissions();
		await testUsersPermissions();
		await testDepartmentsPermissions();

		testRunner.printSummary();

		// Exit with appropriate code
		process.exit(testRunner.results.failed > 0 ? 1 : 0);

	} catch (error) {
		console.error('Fatal error running tests:', error);
		process.exit(1);
	}
}

// Run the tests
runAllTests();