/**
 * @providesModule
 * @flow
 * */

'use strict';
const fs = require('fs');
const Promise = require("bluebird");
const readDir = Promise.promisify(require("fs").readdir);


class ModuleCreator {

  constructor(){
    this.moduleFactorys = {};
    this.moduleLoadOrders = []; // 模块加载顺序列表
  }

  /**
   * 注册模块，同时映射到模块对应文件夹，生成对应的模块处理方法供loadModuleDirs使用
   * @param name 模块名称
   * @param module 模块处理对象，默认带merge
   * @param dirName 模块所在目录名称，默认与模块同名或模块名称+'s'，
   * 如控制层模块目录名为controller或controllers;
   * @param fileSuffix 模块文件后缀
   */
  register (name, module, dirName, fileSuffix) {
    dirName = dirName || name;
    // 创建每个模块的构造工厂（支持异步）
    this.moduleFactorys[dirName] = (app, moduledirs) => {
      if(module.init){
        return this.initModuleFiles(app, moduledirs, module.init, fileSuffix);
      }else{
        app.logger.warn('模块' + module + '必须实现init方法');
        return new Promise(()=>{});
      }
    }
    this.moduleLoadOrders.push(dirName);
  }

  /**
   * 读取并init各模块文件，当模块存在init方法时调用（支持异步）
   * @param app
   * @param moduledirs 各模块路径数组
   * @param init 各模块各自实现的init方法
   */
  initModuleFiles (app, moduledirs, init, fileType) {
    fileType = fileType || 'js';
    const fileUtils = app.utils.file;
    const moduleDirPath = app.config.paths.modules.apply(null, moduledirs);
    if(!fileUtils.isDirectory(moduleDirPath)) return new Promise(()=>{});
    return readDir(moduleDirPath).then((moduleFiles) => {
        let initTasks = [];
        moduleFiles.forEach((moduleFile) => {
          if(moduleFile.indexOf('.' + fileType) == -1) return new Promise(()=>{});
          const fileName = moduleFile.replace('.' + fileType, '');
          const path =
            app.config.paths.modules.apply(null,moduledirs.concat(moduleFile));
          const file = require(path);
          const relativePath = moduledirs.concat(moduleFile).join('/'); // 相对路径
          let initExport; // 模块文件对应要init的导出方法，可以是函数或者promise
          if(typeof file == 'function'){
            initExport = file;
          }else{
            if(typeof file == 'object' && file.init) {
              initExport = file.init;
            }else if(typeof file == 'object' && file.then){
              initExport = file;
            }else{
              app.logger.warn('模块文件' + file + '缺少init方法');
              return new Promise((resolve)=>{});
            }
          }

          let initTask = init(app, initExport, fileName, relativePath, path);
          initTasks.push(initTask);
        });

        //return Promise.all(initTasks);
        return Promise.all(initTasks,()=>{});
    });
  }


  /**
   * 加载模块目录并执行对应方法加载目录内文件
   * @param app 全局应用变量
   * @param appdirs 应用目录数组,如[ 'fund', 'pc' ]
   */
  loadModuleDirs (app, appdirs) {
    const moduleDirPath = app.config.paths.modules.apply(null, appdirs);
    const fileUtils = app.utils.file;
    if(!fileUtils.isDirectory(moduleDirPath)) return new Promise(()=>{});
    // moduledir可以为controllers、middlewares、mocks、routers以及可能的services
    const tasks = [];
    this.moduleLoadOrders.forEach((moduledir)=>{
      const dirArr = appdirs.concat([moduledir]);
      const moduleFactoryPath = app.config.paths.modules.apply(null, dirArr);
      if(!fileUtils.isDirectory(moduleFactoryPath)) return new Promise(()=>{});
      const moduleFactory = this.moduleFactorys[moduledir];
      if(moduleFactory) {
        let task = moduleFactory(app, dirArr);
        tasks.push(task);
      }
    });
    return Promise.each(tasks,()=>{});
  }

  /**
   * 加载公共模块，如modules/public
   * @param app
   * @param dirs
   */

  loadPublicModules (app, dirs) {
    const rootdirs = dirs || [];
    const appdirs = rootdirs.concat(['public']);
    return this.loadModuleDirs(app, appdirs);
  }

  // 加载应用模块，如modules/wap
  loadAppModules (app, dirs) {
    const rootdirs = dirs || [];
    const rootDirPath = app.config.paths.modules.apply(null, rootdirs);
    const fileUtils = app.utils.file;
    if(!fileUtils.isDirectory(rootDirPath)) return new Promise((resolve)=>{});
    return readDir(app.config.paths.modules.apply(null, rootdirs)).then((appdirs) => {
      const tasks = [];
      appdirs.forEach((appdir) => {
        // 匹配多级项目名，类似fund/pc这样的
        if(app.config.name.indexOf('/') > -1){
          const names = app.config.name.split('/');
          if(appdir === names[0]){
            const appdirs = rootdirs.concat(names);
            tasks.push(this.loadModuleDirs(app, appdirs));
          }
        }else if(appdir === app.config.name){ // 匹配普通项目名
          const appdirs = rootdirs.concat([appdir]);
          tasks.push(this.loadModuleDirs(app, appdirs));
        }
      });
      return Promise.each(tasks,()=>{});
      //return Promise.all(tasks);
    });
  }

  /**
   * 加载各应用(包括子应用)模块
   * @param dirs 模块初始路径数组
   */
  loadModules (app, dirs) {
    return Promise.each([
      this.loadPublicModules(app, dirs), // 加载公共模块
      this.loadAppModules(app, dirs) // 加载应用模块
    ],()=>{});
  }


  use (app) {
    return this.loadModules(app);
  }
}

module.exports = new ModuleCreator();