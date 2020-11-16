/**
 * @providesModule
 * @flow
 * */

'use strict';

function create(app) {
  const dbConfig = app.config.database;
  if(!dbConfig || !dbConfig.name) return;
  try {
    const Sequelize = require('sequelize');
    const { type, name, username, password, memory } = dbConfig;
    delete dbConfig.type; // 删除类型
    delete dbConfig.name; // 删除数据库名
    delete dbConfig.username;
    delete dbConfig.password;
    delete dbConfig.memory;
    const dialect = type || 'postgres';
    const finalOption = Object.assign({dialect},dbConfig);

    app.logger.info(`database: username->${username} name->${name}`);
    app.logger.info(`database: option->${JSON.stringify(finalOption)}`)

    const sequelize = new Sequelize(name, username, password, finalOption);
    return {
      Sequelize,
      sequelize
    }
  }catch(err){
    app.logger.info(err);
  }
}


module.exports = {
  create
}