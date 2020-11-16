/**
 * @providesModule
 * @flow
 * */

'use strict';


/**
 * 获取解析路径，优先级为controller配置里的paths->template里的paths
 * 同时将路径数组中的path替换成当前路径并输出
 * @param ctx
 * @returns {Array}
 */
module.exports = function (ctx) {
  const config = ctx.config || {};
  const ctrl = ctx.controller || {};
  const path = ctx.stablePath || ctx.path;
  const paths = (ctrl.paths && Array.isArray(ctrl.paths))
    ? ctrl.paths
    : ((config.template && config.template.paths) ? config.template.paths : null);

  const finalPaths = [];
  for (var i = 0, n = paths.length; i < n; i++) {
    finalPaths[i] = paths[i] === 'path' ? path : paths[i];
  }
  return finalPaths;
};