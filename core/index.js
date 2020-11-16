'use strict';
const controller = require('./controller');
const middleware = require('./middleware');
const mock = require('./mock');
const moduleCreator = require('./moduleCreator');
const logger = require('./logger');
const database = require('./database');

module.exports = {
  controller,
  middleware,
  logger,
  mock,
  database,
  moduleCreator
};