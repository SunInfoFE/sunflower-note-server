/**
 * Created by caoLiXin on 2018/3/13.
 */
const router = require('koa-router')();
const journal = require('../controller/journal');

router.prefix('/journal');

/**
 * 获取所有本周工作日志接口
 * url: /journal/getAllCurrentWeekJournal
 */
router.get('/getAllCurrentWeekJournal', journal.get);


module.exports = router;