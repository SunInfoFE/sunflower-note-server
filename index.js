const Koa=require('koa');
const path=require('path')
const bodyParser = require('koa-bodyparser');  // 表单解析中间件
const ejs=require('ejs');  // 模板
const session = require('koa-session-minimal');  // 处理数据库中间件
const MysqlStore = require('koa-mysql-session');  // 处理数据库中间件
const config = require('./config/default.js');  // 相关的配置文件
const router=require('koa-router')   // 路由中间件
const views = require('koa-views')  // 模板引擎
const koaStatic = require('koa-static')  // 静态资源加载中间件
const routers = require('./routers')  // 路由文件
const app=new Koa()

// session存储配置
const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
    port: config.database.PORT,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname , './public')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

// 使用表单解析中间件
app.use(bodyParser())

// 使用新建的路由文件
routers(app)

// 监听在3000端口
app.listen(3000, () => {
  console.log(`listening on port 3000`)
})