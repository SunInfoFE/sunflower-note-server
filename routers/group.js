/**
 * Created by caoLiXin on 2018/3/2.
 */
const router = require('koa-router')();
const query = require('../lib/mysql.js');
const md5 = require('md5')  // 加密

router.prefix('/group')

router.get('/', async (ctx, next) => {
  ctx.body = {
    title: 222222222
  }
})

router.post('/g', async (ctx, next) => {
})

module.exports = router