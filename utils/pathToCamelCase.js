/**
 * @providesModule
 * @flow
 * */

'use strict';
const firstWordToUpper = require('./firstWordToUpper');
const firstWordToLower = require('./firstWordToLower');

// 路径转驼峰写法
function pathToCamelCase(path, firstLower) {
  firstLower = firstLower || false;
  const parts = path.split('/');

  let output = '';
  for (let part of parts) {
    output = output + firstWordToUpper(part);
  }

  // 首字母是否小写(默认为大写)
  return firstLower ? firstWordToLower(output, 'lower') : output;
}

module.exports = pathToCamelCase;