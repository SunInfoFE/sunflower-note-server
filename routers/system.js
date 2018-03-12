/**
 * Created by caoLiXin on 2018/3/12.
 */
const router = require('koa-router')();

let system = require('../controller/system');

router.prefix('/system');

/**
 * 管理员系统设置接口
 * url: /system/systemSetting
 */
router.post('/setSysSetting', system.set);

/**
 * 获取系统设置接口
 * url: /system/getSysSetting
 */
router.get('/getSysSetting', system.get);


module.exports = router;