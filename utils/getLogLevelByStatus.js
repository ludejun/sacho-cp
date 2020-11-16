/**
 * @providesModule
 * @flow
 * */

'use strict';

module.exports = function (status) {
  let level;
  if(status >= 500) { level = 'error'; }
  else if(status >= 400) { level = 'warn'; }
  else if(status >= 100) { level = 'info'; }

  return level;
}