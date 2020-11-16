"use strict"
const _ = require('lodash');

function init(app, exportMock,fileName, path) {
  const mock = exportMock(app);
  if(!app.mocks) app.mocks = {};
  for (let key of Object.keys(mock)) {
    if(app.mocks[key]) app.logger.warn(path + '下的mock配置' + key + '重复');
    app.mocks[key] = mock[key];
  }
  return mock;
}

function set(ctx,isMock = false) {
  ctx.isMock = isMock;
}

// 判断当前响应是否为mock
function isMock(ctx) {
  return ctx.isMock;
}

module.exports = {
  init,
  set,
  isMock
};