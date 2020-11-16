/**
 * @providesModule
 * @flow
 * */

'use strict';

/**
 * 创建随机字母
 * @param strLen
 * @returns {string}
 */
function createRandomLetter(strLen) {
  strLen = strLen || 4;

  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    i, j, ramdomLetter = '';

  for (i = 0; i < strLen; i++) {
    j = Math.round(Math.random() * 25) + 0;
    ramdomLetter = ramdomLetter + letters[j];
  }

  return ramdomLetter;
}

module.exports = createRandomLetter;