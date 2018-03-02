/**
 * Created by caoLiXin on 2018/3/2.
 */
const router = require('koa-router')();
const query = require('../lib/mysql.js');
const md5 = require('md5')  // 加密

router.prefix('/report')

router.get('/', async (ctx, next) => {
})

router.post('/r', async (ctx, next) => {
})

module.exports = router