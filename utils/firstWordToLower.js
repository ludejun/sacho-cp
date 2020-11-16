/**
 * @providesModule
 * @flow
 * */

'use strict';

module.exports = function (str) {
  return str.substr(0,1).toLocaleLowerCase() + str.substr(1);
};