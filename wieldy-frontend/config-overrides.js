// const path = require("path");

// module.exports = function override(config) {
//   config.resolve.fallback = {
//     ...config.resolve.fallback,
//     path: require.resolve("path-browserify"),
//     crypto: require.resolve("crypto-browserify"),
//     os: require.resolve("os-browserify/browser"),
//     buffer: require.resolve("buffer/"),
//     stream: require.resolve("stream-browserify"),
//     vm: require.resolve("vm-browserify"),
//     process: require.resolve("process/browser"),
//   };
//   return config;
// };

const path = require("path");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
    process: require.resolve("process/browser"),
  };
  return config;
};
