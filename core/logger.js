/**
 * @providesModule
 * @flow
 * */

'use strict';
const fs = require('fs');
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

// 创建日志打印方法
function create(app,opts) {
  opts = opts || {};
  const config = app.config;
  const logsPath = getLogsPath(config);
  const consoleTransport = new winston.transports.Console({
    timestamp: dateFormat,
    colorize: true
  });

  const defaultOpts = {
    name: 'all',
    filename: logsPath + '/' + config.name + '-all.log',
    timestamp: dateFormat,
    //level: 'info',
    colorize: true,
    json: false,
    datePattern: '.yyyy-MM-dd'
  }
  const finalOpts = Object.assign({},defaultOpts,opts); // 合并配置
  const infoTransport = new DailyRotateFile(finalOpts);

  if(app.config && !app.config.__PROD__){
    const errorTransport = new (winston.transports.File)({
      name: 'error',
      filename: logsPath + '/' + config.name + '-error.log',
      timestamp: dateFormat,
      json: false,
      level: 'error',
      colorize: true
    });
    return new (winston.Logger)({
      transports: [infoTransport, consoleTransport]
    });
  }else{
    return new (winston.Logger)({
      transports: [infoTransport, consoleTransport]
    });
  }
}

// 日志日期格式
function dateFormat() {
  return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};

// 获取日志输出目录
function getLogsPath(config) {
  const logsPath = config.log && config.log.path &&
  fs.existsSync(config.log.path)
    ? config.log.path
    : config.paths.base();

  return logsPath;
}

module.exports = {
  create,
  getLogsPath
};