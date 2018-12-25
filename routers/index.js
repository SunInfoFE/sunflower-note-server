const router = require('koa-router')();

/**
 * 各模块路由引入
 */
const user = require('./user');
const report = require('./report');
const group = require('./group');
const system = require('./system');
const journal = require('./journal');
const card = require('./card');
const order = require('./order');
const ip = require('./ip');

/**
 * 统一挂载router级中间件路由
 */
router.use(user.routes(), user.allowedMethods());
router.use(report.routes(), report.allowedMethods());
router.use(group.routes(), group.allowedMethods());
router.use(system.routes(), system.allowedMethods());
router.use(journal.routes(), journal.allowedMethods());
router.use(card.routes(), card.allowedMethods());
router.use(order.routes(), order.allowedMethods());
router.use(ip.routes(), ip.allowedMethods());

module.exports = router;