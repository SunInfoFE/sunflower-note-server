/**
 * 各模块路由引入
 */
const user = require('./user')
const report = require('./report')
const group = require('./group')

/**
 * 路由挂载
 * @param app
 */
module.exports = function (app) {
  app.use(user.routes(), user.allowedMethods())
  app.use(report.routes(), report.allowedMethods())
  app.use(group.routes(), group.allowedMethods())
}