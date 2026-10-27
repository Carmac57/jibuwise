import { runCalculationTests } from './calculations.test';

console.log('Running JibuWise Calculation Regression Tests...\n');
const result = runCalculationTests();

console.log(`\n========================================`);
console.log(`TOTAL TESTS : ${result.total}`);
console.log(`PASSED      : ${result.passed}`);
console.log(`FAILED      : ${result.failed}`);
console.log(`========================================\n`);

if (result.failed > 0) {
  console.error('Test Failures:');
  result.failures.forEach((f) => {
    console.error(`- ${f.testName}`);
    console.error(`  Expected: ${f.expected}`);
    console.error(`  Received: ${f.received}`);
  });
  process.exit(1);
} else {
  console.log('All regression tests passed successfully!');
  process.exit(0);
}
