/**
 * Created by caoLiXin on 2018/3/2.
 */
var router = require('koa-router')();
var userModel = require('../lib/mysql.js');

// post 登录
router.post('/login',async (ctx,next) => {
  ctx.body = 'login'
})

module.exports = router