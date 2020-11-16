/**
 * @providesModule
 * @flow
 * */
'use strict';
var _ = require('lodash')
// 判断/a/b 与/a/*是否匹配
function pathIsMatch(path,pattern) {
  var pathArr = path.split('/');
  var patternArr = pattern.split('/');
  var pathArr = _.compact(pathArr);
  var patternArr = _.compact(patternArr);
  for (var i = 0, n = patternArr.length; i < n; i++) {
    var pat = patternArr[i];
    var pa = pathArr[i];
    if(pat === '*') return true;
    if(pa && pa === pat){
      continue;
    }else{
      return false;
    }
  }
  return true;
}

module.exports = pathIsMatch;