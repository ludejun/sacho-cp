/**
 * @providesModule
 * @flow
 * */

'use strict';

/**
 * 创建随机数
 * @param numLen
 * @returns {string}
 */
function createRandomNumber(numLen) {
  numLen = numLen || 4;

  var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    i, j, ramdomNumber = '';

  for (i = 0; i < numLen; i++) {
    j = Math.round(Math.random() * 9) + 0;
    ramdomNumber = ramdomNumber + numbers[j];
  }

  return ramdomNumber;
}

module.exports = createRandomNumber;