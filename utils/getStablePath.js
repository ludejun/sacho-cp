/**
 * @providesModule
 * @flow
 * */

'use strict';


// 获取稳定的路径(剔除了/:等变量的干扰)

module.exports = function (ctx) {
  if(!ctx.matched || !ctx.matched[0].path) return ctx.path;
  const matchedPath = ctx.matched[0].path;
  if(matchedPath.indexOf('/:') === -1) return matchedPath;

  const paths = matchedPath.split('/');
  let stablePath = '';
  for (let path  of paths) {
    if(path === '' || path.indexOf(':')>-1) continue;
    stablePath += '/' + path;
  }
  return stablePath;
};