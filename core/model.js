"use strict"
const _ = require('lodash');

/**
 * 创建数据库各表的model，与表一一对应，之后供service使用
 * @param app
 * @param model
 * @param fileName
 * @param path
 */
function init(app, exportModel,fileName, path) {
  const dbConfig = app.config.database || {};
  if(!dbConfig.host) return;
  const model = exportModel(app);
  if(!app.models) app.models = {};
  //console.log('fileName',fileName);
  if(typeof model == 'function'){ // 如果返回函数则直接挂载
    app.models[fileName] = model;
  }else if(typeof model == 'object'){ // 如果是对象则进一步判断
    if(model.then && typeof model.then === 'function'){ // 判断是否是promise
      return model.then((md) => {
        app.models[fileName] = md;
        return md;
      });
    }else{ // 普通对象则验证是否存在default字段，不存在则提示
      if(!model.default) {
        app.logger.warn(`model:${fileName}返回配置未设置默认model`);
        return;
      }
      app.models[fileName] = model.default;
      for (let key of Object.keys(model)) {
        app.models[fileName][key] = model[key];
      }
    }
  }else{
    app.logger.warn(`model:${fileName}返回配置格式错误`);
  }
  return model;
}

module.exports = {
  init
};