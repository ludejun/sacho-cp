/**
 * @providesModule
 * @flow
 * */

'use strict';

function unitToWan(input, dot, hide) {
  dot = Number(dot || 0);

  input = input ? parseFloat(input) : 0;
  const isWan = input >= 10000 ? true : false;
  input = input >= 10000 ? input/10000 : input;
  input = dot >- 1 ? parseFloat(input) : input;
  if(!hide && isWan) input = input + '万';

  return input;
}

module.exports = unitToWan;