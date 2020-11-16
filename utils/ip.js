/**
 * @providesModule
 * @flow
 * */

'use strict';
const os = require('os');

// 获取客户端ip
module.exports = {
  // 客户端ip
  client: function (req) {
    return req.headers["x-real-ip"] || req.headers['remote_addr'];
  },
  // 服务器ip
  server: function (req) {
    req.connection.remoteAddress;
  },
  // 本地ip
  local: function () {
    const interfaces = os.networkInterfaces();

    for(let devName in interfaces){
      const iface = interfaces[devName];
      for(let i=0; i<iface.length; i++){
        const alias = iface[i];
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
          return alias.address;
        }
      }
    }
  }
}