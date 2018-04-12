const router = require('koa-router')();
const md5 = require('md5');  // 加密

const user = require('../controller/user');
const sendMailUser = require('../controller/user/sendMailUserInfo');

router.prefix('/user');

/**
 * 用户注册接口
 * url: /user/register
 */
router.post('/register', user.register);

/**
 * 重新发送激活邮件接口
 * url: /user/resendActiveEmail
 */
router.post('/resendActiveEmail', user.resendActiveEmail);

/**
 * 用户激活接口
 * url: /user/activeAccount/:activeCode
 */
router.get('/activeAccount/:activeCode', user.activeAccount);

/**
 * 用户登录接口
 * url: /user/login
 */
router.post('/login', user.userLogin);

/**
 * 管理员登录接口
 * url: /user/adminLogin
 */
router.post('/adminLogin', user.adminLogin);

/**
 * 注销/退出系统
 * url: /user/logOut
 */
router.get('/logOut', user.logOut);

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


/**
 * 新增发送邮件用户
 * url: /user/addSendMailUser
 */
router.post('/addSendMailUser', sendMailUser.add);

/**
 * 删除发送邮件用户
 * url: /user/deleteSendMailUser
 */
router.post('/deleteSendMailUser', sendMailUser.del);

/**
 * 获取发送邮件用户
 * url: /user/getSendMailUser
 */
router.get('/getSendMailUser', sendMailUser.get);

/**
 * 更新/编辑发送邮件用户
 * url: /user/updateSendMailUser
 */
router.post('/updateSendMailUser', sendMailUser.update);



module.exports = router;