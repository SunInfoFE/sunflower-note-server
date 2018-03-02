const router = require('koa-router')();
const md5 = require('md5')  // 加密

const user = require('../controller/user')

router.prefix('/user')

/**
 * 用户注册接口
 * url: /users/register
 */
router.post('/register', user.register())

/**
 * 用户登录接口
 * url: /users/login
 */
router.post('/login', user.login())

/**
 * 用户改密接口
 * url: /users/changePassword
 */
router.post('/changePassword', user.changePassword())


module.exports = router