"use strict"
const _ = require('lodash');

/**
 * 创建service供controller服务，model和数据库的查询也存放在此，可被多个controller使用
 * @param app
 * @param service
 * @param fileName
 * @param path
 */
function init(app, exportService, fileName, path) {
  const service = exportService(app);
  if(!app.services) app.services = {};
  if(typeof service == 'object'){
    app.services[fileName] = service;
  }else{
    app.logger.warn(`service:${fileName}返回配置格式错误`)
  }
  return service;
}

module.exports = {
  init
};