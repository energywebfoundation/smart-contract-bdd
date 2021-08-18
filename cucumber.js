let common = [
  'features/**/*.feature',                // Specify our feature files
  '--format progress-bar',                // Load custom formatter
  '--format json:./reports/cucumber-json-reports/report.json',
  '--format rerun:@rerun.txt',
  '--format usage:usage.txt',
  '--parallel 20',
  '--require ./build/features/step_definitions/**/*.js',
  '--require ./build/features/step_definitions/*.js',
  '--require ./build/features/support/*.js'
].join(' ');

module.exports = {
  default: common
};
