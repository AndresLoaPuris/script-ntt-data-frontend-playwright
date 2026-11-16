export default {
  paths: ['src/features/**/*.feature'],
  import: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: ['progress', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
  parallel: 2,
};
