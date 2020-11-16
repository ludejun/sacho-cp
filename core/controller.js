'use strict';
/**
 * 控制层配置
 * angular: {
   *   includes: [],
   *   open: false
   * },
 * paths: []
 * break: false 流程是否直接在controller结束,是否添加还是自动化?
 * @param controller
 */
function init(app, exportFile, fileName, path) {
  const file = exportFile(app);
  const fileConf = file.config || {}; // 提取控制层文件公共配置
  delete file.config;
  if(!app.controllers) app.controllers = {};
  //app.controllers[fileName] = fileConf;// 挂载文件公共配置
  for (let name of Object.keys(file)) {
    // if(name === 'config') continue;
    if(app.controllers[name]) app.logger.warn(path + '下的controller配置' + name + '重复');
    app.controllers[name] = file[name]; // 挂载路由控制层(含配置和执行代码等)
    // 挂载路由控制层配置
    app.controllers[name].config = Object.assign({}, fileConf, file[name].config || {});
  }
  return file;
}

module.exports = {
  init
}