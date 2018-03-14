/**
 * Created by caoLiXin on 2018/3/13.
 */
const router = require('koa-router')();
const journal = require('../controller/journal');

router.prefix('/journal');

/**
 * 获取所有本周工作日志接口
 * url: /journal/currentWeekJournal/getAll
 */
router.get('/currentWeekJournal/getAll', journal.getAll);

/**
 * 新增本周工作日志接口
 * url: /journal/currentWeekJournal/add
 */
router.post('/currentWeekJournal/add', journal.add);

/**
 * 编辑本周工作日志接口
 * url: /journal/currentWeekJournal/edit
 */
router.post('/currentWeekJournal/edit', journal.edit);

/**
 * 修改工作日志状态 status 接口
 * url: /journal/currentWeekJournal/changeStatus
 */
router.post('/currentWeekJournal/changeStatus', journal.changeStatus);

/**
 * 将所选'工作记录'形成的预览周报，保存为周报草稿接口
 * url: /journal/currentWeekJournal/saveDraft
 */
router.post('/currentWeekJournal/saveDraft', journal.saveDraft);

/**
 * 将所选'工作记录'形成的预览周报，直接提交至小组周报接口
 * url: /journal/currentWeekJournal/submitDraft
 */
router.post('/currentWeekJournal/submitDraft', journal.submitDraft);


module.exports = router;