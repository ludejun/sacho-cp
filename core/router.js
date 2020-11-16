"use strict"
const _ = require('lodash');

let routers = {};

function init(app, exportRouter) {
  return exportRouter(app);
}

module.exports = {
  init
};