const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');  // 表单解析中间件
const ejs = require('ejs');  // 模板
const session = require('koa-session-minimal');  // 处理数据库中间件
const MysqlStore = require('koa-mysql-session');  // 处理数据库中间件
const config = require('./config/default.js');  // 相关的配置文件
const router = require('koa-router');   // 路由中间件
const views = require('koa-views'); // 模板引擎
const koaStatic = require('koa-static');  // 静态资源加载中间件
const routers = require('./routers');  // 路由文件
const app = new Koa();

// session存储配置
const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
    port: config.database.PORT,
};

// 配置session中间件
/* app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
})) */

// 配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname , './public')
));

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

// 使用表单解析中间件
app.use(bodyParser());

// 应用处理 session 的中间件
app.use(session({
  key: 'session-id',          // cookie 中存储 session-id 时的键名, 默认为 koa:sess
  cookie: {                   // 与 cookie 相关的配置
    domain: 'localhost',      // 写 cookie 所在的域名
    path: '/',                // 写 cookie 所在的路径
    maxAge: 1000 * 30,        // cookie 有效时长
    httpOnly: true,           // 是否只用于 http 请求中获取
    overwrite: false          // 是否允许重写
  }
}));

/**
 * 接口调用信息日志输出
 */
app.use(async (ctx, next) => {
  let reqData = {
    href: ctx.href,
    origin: ctx.origin,
    host: ctx.host,
    date: new Date(parseInt(ctx.query.t)).toLocaleString(),
    api: {
      method: ctx.method,
      originalUrl: ctx.originalUrl,
      url: ctx.url,
      ip: ctx.ip,
      path: ctx.path,
      query: ctx.query,
      querystring: ctx.querystring
    }
  };
  console.log(`==========REQUEST==LOGGER==START==========`);
  console.log(reqData);
  console.log(`===========REQUEST==LOGGER==END===========`);

  await next()
});

/**
 * 登录状态判断
 */
app.use(async (ctx, next) => {
  if (ctx.path !== '/user/login') {
    if (!ctx.session.userId) {
      ctx.body = {
        status: false,
        data: ' Not Login'
      }
    } else {
      await next()
    }
  } else {
    await next()
  }
});

// 挂载路由
app.use(routers.routes(), routers.allowedMethods());

// 监听在3000端口
app.listen(9898, () => {
  console.log(`listening on port 9898`)
});