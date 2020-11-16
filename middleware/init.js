"use strict"

// == 初始化中间件
module.exports = function (app) {
  return function* (next) {
    if(!this.config) this.config = app.config;
    if(!this.logger) this.logger = app.logger;
    if(!this.utils) this.utils = app.utils;
    if(!this.core) this.core = app.core;
    //this.body = getWellcome(app);
    yield next;
  }
}

function getWellcome(app) {
  const config = app.config;
  const server_dir = config.paths.server();
  const client_dir = config.paths.client();
  const logs_dir = app.core.logger.getLogsPath(config);
  return `欢迎使用sacho框架！
服务端默认目录:${server_dir}
客户端默认目录:${client_dir}
当前日志目录为:${logs_dir}
请在配置中修改默认目录指向！
`;
  //return "欢迎使用sacho框架！"+ "当前服务端默认目录为:" + client_dir;
}