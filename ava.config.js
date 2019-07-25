/* eslint-disable node/no-unsupported-features/es-syntax */
export default {
  files: [
    "test/**/*.test.js"
  ],
  source: [
    "src/**/*.js"
  ],
  require: [
    "./test/helpers/setup-browser-env.js"
  ],
  concurrency: 1,
  failFast: false,
  tap: false,
  babel: false,
  compileEnhancements: false,
  verbose: true,
};
