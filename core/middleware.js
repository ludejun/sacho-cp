'use strict'
const compose = require('koa-compose');
/**
 * 添加各路由中间件
 * @param midConfig 路由中间件配置
 * @param fileName 中间件文件名
 * @return 返回一个对象，类似middleware.proxy.safe()这样调用
 */
function init(app, exportMidConfig,fileName) {
  const midConfig = exportMidConfig(app);
  const isMock = app.config.mock.open;/*接口模拟状态*/
  const env = isMock && !app.config.__PROD__ ? 'mock' : 'prod'
  let mids = midConfig[env];
  if(!mids) {
    app.logger.warn('没有' + env + '环境下的中间件配置');
    return;
  }

  if(!app.middlewares) app.middlewares = {};

  if(Array.isArray(mids)){
    if(app.middlewares[fileName]) app.logger.warn('中间件配置' + fileName + '重复!');
    app.middlewares[fileName] = (forceMock) => {
      const finalEnv = forceMock && !app.config.__PROD__ ? 'mock' : env;
      return compose(midConfig[finalEnv])
    };
  }else if(typeof mids == 'object'){
    if(app.middlewares[fileName]) app.logger.warn('中间件配置' + fileName + '重复!');
    app.middlewares[fileName] = {};
    for (let name of Object.keys(mids)) {
      if(Array.isArray(mids[name])){
        if(app.middlewares[fileName][name])
          app.logger.warn('中间件配置' + fileName + '.' + name + '重复!');
        app.middlewares[fileName][name] = (forceMock) => {
          const finalEnv = forceMock && !app.config.__PROD__ ? 'mock' : env;
          return compose(midConfig[finalEnv][name]);
        }
      }else{
        app.logger.warn('中间件配置只支持2层配置');
      }
    }
  }
  return midConfig;
}

module.exports = {
  init
};