/**
 * @providesModule
 * @flow
 * */

'use strict';


/**
 * 获取baseUrl
 */
module.exports = function (ctx) {
  var protocol = ctx.config.protocol || 'https';
  var host = ctx.request.header.host;
  protocol = host.indexOf('localhost') > -1 ? 'http' : protocol; // 本地默认为http
  //if(config.__DEV__ && host.indexOf('139.196.54.250') > -1) protocol = 'http';

  // baseUrl和staticUrl
  return protocol + '://' + host;
};