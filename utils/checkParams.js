/**
 * @providesModule
 * @flow
 * */

'use strict';
const _ = require('lodash');

/**
 * // 检查post传参
 * @param params 传入的参数
 * @param fields 待验证字段
 * @returns {{errCode: string, errMsg: string}}
 */
function checkParams(params, fields) {
  var errorMessages=[];
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if(_.isArray(field)){// 如果是数组,则检测字段名和值
      if(!params[field[0]]){
        errorMessages.push(field[0]+':'+field[1]);
      }else if(params[field[0]]!==field[1]){
        errorMessages.push(field[0]+'!=='+field[1]);
      }
    }else{// 默认情况下只检测字段名
      if(!params[field] && params[field]!=''){
        errorMessages.push(field);
      }
    }
  }

  return {
    passed: function (callback) {
      if(errorMessages.length===0){
        return callback(params);
      }else{
        return {
          code:'8999',
          message:'传入参数有误: ' + errorMessages.toString()
        };
      }
    }
  }
}

module.exports = checkParams;