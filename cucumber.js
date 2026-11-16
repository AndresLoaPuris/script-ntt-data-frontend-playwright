export default {
  paths: ['src/features/**/*.feature'],
  import: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: ['progress', 'json:reports/cucumber-report.json'],
  parallel: 2,
};
