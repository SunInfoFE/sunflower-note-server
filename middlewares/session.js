/**
 * Created by caoLiXin on 2018/3/7.
 */
const config = require('../config/default');        // 数据库相关的配置文件
const session = require('koa-session-minimal');         // 处理数据库中间件
const MysqlStore = require('koa-mysql-session');    // 处理数据库中间件

let createSession = (app) => {
  // session数据库存储配置
  const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
    port: config.database.PORT,
  };

  // session/cookie 属性配置
  let sessionOptions = {
    key: 'session-id',              // cookie 中存储 session-id 时的键名, 默认为 koa:sess

    overwrite: true,
    httpOnly: true,
    rolling: false,
    renew: true,

    cookie: {                       // 与 cookie 相关的配置
      domain: '',                   // 写 cookie 所在的域名
      path: '/',                    // 写 cookie 所在的路径
      maxAge: 1000 * 60 * 10,       // cookie 有效时长(单位：ms)
      httpOnly: true,               // 是否只用于 http 请求中获取
      overwrite: true               // 是否允许重写
    },

    store: new MysqlStore(sessionMysqlConfig)
  };

  app.use(async (ctx, next) => {
    // 获取hostname，设置cookie的domain属性值
    sessionOptions.cookie.domain = ctx.hostname;
    await next();
  });

  app.use(session(sessionOptions));
};


module.exports = createSession;