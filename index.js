const Koa = require('koa');
const cors = require('koa2-cors');
const path = require('path');
const config = require('./config/default.js')
const bodyParser = require('koa-bodyparser');           // 表单解析中间件
const ejs = require('ejs');                             // 模板
const router = require('koa-router');                   // 路由中间件
const views = require('koa-views');                     // 模板引擎
const koaStatic = require('koa-static');                // 静态资源加载中间件
const routers = require('./routers');                   // 路由文件
const createSession = require('./middlewares/session'); // session相关配置
const setCors = require('./middlewares/cors');          // 跨域设置
const logger = require('./middlewares/logger');         // 接口调用日志输出
const check = require('./middlewares/check');           // 登录状态检测
const logUtil = require('./middlewares/log_util');      // 记录日志
const app = new Koa();


// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname, './public')
));

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}));

// 使用表单解析中间件
app.use(bodyParser());

// 接口调用信息日志输出
app.use(logger);

// 日志接口调用信息日志输出
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  let ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

// 配置session中间件
createSession(app);

// 跨域配置
setCors(app);

// 登录状态判断
app.use(check);

// 挂载路由
app.use(routers.routes(), routers.allowedMethods());

// 重定向
app.use((ctx, next) => {
  ctx.redirect('/')
})

// 监听在3000端口
app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
});