'use strict';
const path = require('path');
const argv = require('yargs').argv;

const appName = argv.project || 'app';
const env = process.env.NODE_ENV || 'development';

let config  = {
  name: appName, // 项目名称
  env: env, // production | development
  dir_base: process.cwd(),
  dir_client: 'app',    // 客户端目录名
  dir_server: 'server', // 服务端根目录名
  dir_modules: 'modules',
  '__DEV__': env === 'development',
  '__PROD__': env === 'production',
};

// == 路径配置
config.paths = {
  base,
  client: base.bind(null, config.dir_client), // 客户端目录(自动判断环境)
  server: base.bind(null, config.dir_server), // 服务端
  modules: base.bind(null, config.dir_server, config.dir_modules) // 服务端模块
};

function base() {
  const args = Array.prototype.slice.call(arguments);
  return path.resolve.apply(null, [config.dir_base].concat(args));
}

module.exports = config;