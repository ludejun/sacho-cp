'use strict';
const moduleCreator = require('./core/moduleCreator');

// 各模块
const routerModule = require('./core/router');
const middlewareModule = require('./core/middleware');
const controllerModule = require('./core/controller');
const modelModule = require('./core/model');
const serviceModule = require('./core/service');
const mockModule = require('./core/mock');

// == 核心中间件
const gzip = require('koa-gzip');
const fresh = require('koa-fresh');
const etag = require('koa-etag');
const cacheControl = require('koa-cache-control');
const session = require('koa-session');
const cors = require('koa-cors');
const init = require('./middleware/init');

// const render = require('./middleware/render');

module.exports = (app, midCreators = []) => {
  // 加载前置中间件
  app.use(gzip());
  app.use(fresh());
  app.use(etag());
  if(!app.config.__DEV__) app.use(cacheControl({maxAge: 0}));

  // == 配置并加载cors跨域中间件
  app.use(cors({
    origin:'*',
    maxAge: app.config.maxAge / 1000,
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, POST',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  }));

  // == 配置并加载session中间件
  app.keys = ['sacho'];
  app.use(session(app,{
    key: 'SESSID',
    httpOnly: true,
    expries: 'session',
    domain: app.config.__DEV__ || app.config.__TEST__
      ? '' : (app.config.sessionDomain || '.' + app.config.domain)
  }));

  app.use(init(app)); // 初始化中间件

  // 加载自定义通用中间件
  for (var i = 0, n = midCreators.length; i < n; i++) {
    var midCreator = midCreators[i];
    app.use(midCreator(app));
  }

  // 注册应用模块
  moduleCreator.register('middlewares',middlewareModule);
  moduleCreator.register('routers',routerModule);
  moduleCreator.register('models',modelModule);
  moduleCreator.register('services',serviceModule);
  moduleCreator.register('controllers',controllerModule);
  if(!app.config.__PROD__)
    moduleCreator.register('mocks',mockModule);

  // 加载各应用模块中间件
  return moduleCreator.use(app);
};
