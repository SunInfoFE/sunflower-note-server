const router = require('koa-router')();
const md5 = require('md5');  // 加密

const user = require('../controller/user');

router.prefix('/user');

/**
 * 用户注册接口
 * url: /user/register
 */
router.post('/register', user.register);

/**
 * 用户登录接口
 * url: /user/login
 */
router.post('/login', user.login);

/**
 * 获取用户信息和所属组接口
 * url: /user/getUserInfo
 */
router.get('/getUserInfo', user.getUserInfo);

/**
 * 用户改密接口
 * url: /user/changePassword
 */
router.post('/changePassword', user.changePassword);

/**
 * 用户更改个人信息接口
 * url: /user/changeUserInfo
 */
router.post('/changeUserInfo', user.changUserInfo);


module.exports = router;