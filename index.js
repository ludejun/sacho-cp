'use strict';
const koa = require('koa');
const app = koa();
const defaultConfig = require('./config');
const core = require('./core');
const utils = require('./utils');

const start = (config, midCreators) => {
  if(typeof config == 'number') {
    const port = config;
    config = { port };
  }
  config = Object.assign({}, defaultConfig, config); // 合并默认配置

  // 全局config和utils
  app.config = config;
  app.core = core;
  app.utils = utils;

  // 全局logger
  app.logger = core.logger.create(app);

  // // 数据库
  // app.database = core.database.create(app);

  // 主入口
  app.logger.info('server local ip is: ' + utils.ip.local());
  const main = require('./main');
  return main(app, midCreators).then(() => {
    app.listen(config.port);

    app.logger.info('server is running on port: ' + config.port);

    app.logger.info('server dir is: ' + config.paths.server());
    // app.logger.info('client dir is: ' + config.paths.client());
    // app.logger.info('logs dir is: ' + core.logger.getLogsPath(app.config));
    app.logger.info('=========== start up ===========');
  },(err)=>{
    app.logger.warn(err);
  });
}

module.exports = {
  start,
  utils,
  core
}