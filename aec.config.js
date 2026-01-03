// aec.config.js
const { PythonExpertKit } = require('./plugins/aec-kit-python-expert');
const{ PluginDevKit } = require('./plugins/aec-kit-plugin-dev');

module.exports = {
  lang: 'zh', // 生成中文提示词
  plugins: [
    PluginDevKit
  ]
};