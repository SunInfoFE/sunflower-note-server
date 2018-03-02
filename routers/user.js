const router = require('koa-router')();
const query = require('../lib/mysql.js');
const md5 = require('md5')  // 加密

router.prefix('/user')

// POST 注册
router.get('/register', async (ctx, next) => {
  ctx.body = 'register'
})

// post 登录
router.post('/login', async (ctx, next) => {
  ctx.body = 'login'
})


module.exports = router