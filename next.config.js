/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['echarts', 'zrender']);

module.exports = withTM({
  reactStrictMode: true,
});
