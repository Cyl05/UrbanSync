class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: [],
        };
    }

    logTest(testName, passed, message = '') {
        this.results.tests.push({ testName, passed, message });
        if (passed) {
            this.results.passed++;
            console.log(`  ✓ ${testName}`);
        } else {
            this.results.failed++;
            console.log(`  ✗ ${testName}: ${message}`);
        }
    }

    printSummary() {
        const total = this.results.passed + this.results.failed;
        const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(2) : 0;

        console.log('\n╔════════════════════════════════════════════════╗');
        console.log('║                   TEST SUMMARY                  ║');
        console.log('╚════════════════════════════════════════════════╝');
        console.log(`Total Tests: ${total}`);
        console.log(`✓ Passed: ${this.results.passed}`);
        console.log(`✗ Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${successRate}%`);

        if (this.results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.tests
                .filter(t => !t.passed)
                .forEach(t => console.log(`  - ${t.testName}: ${t.message}`));
        }
    }

    reset() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: [],
        };
    }
}

export default new TestRunner();
