/**
 * Created by caoLiXin on 2018/3/2.
 */
var router = require('koa-router')();
var userModel = require('../lib/mysql.js');
var md5 = require('md5')  // 加密

// POST 注册
router.get('/register', async (ctx, next) => {
  ctx.body = 'register'
})

module.exports = router;