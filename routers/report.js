/**
 * Created by caoLiXin on 2018/3/2.
 */
const router = require('koa-router')();
const md5 = require('md5'); // 加密

const currentWeekReport = require('../controller/report/currentWeekReport');
const myReport = require('../controller/report/myReport');
const groupReport = require('../controller/report/groupReport');

router.prefix('/report');

/**
 * 获取当前用户本周周报接口
 * url： /report/currentWeekReport/get
 */
router.get('/currentWeekReport/get', currentWeekReport.getAll);

/**
 * 添加周报接口
 * url： /report/currentWeekReport/add
 */
router.post('/currentWeekReport/add', currentWeekReport.add);

/**
 * 编辑周报接口
 * url： /report/currentWeekReport/edit
 */
router.post('/currentWeekReport/edit', currentWeekReport.edit);

/**
 * 删除周报接口
 * url： /report/currentWeekReport/get
 */
router.post('/currentWeekReport/delete', currentWeekReport._delete);

/**
 * 提交周报接口
 * url： /report/currentWeekReport/get
 */
router.post('/currentWeekReport/submit', currentWeekReport.submit);

/**
 * 撤回已经提交周报(取消提交)接口
 * url： /report/currentWeekReport/get
 */
router.post('/currentWeekReport/cancelSubmit', currentWeekReport.cancelSubmit);

/**
 * 获取当前用户所有周报接口
 * url： /report/myReport/get
 */
router.post('/myReport/get', myReport.getAll);

/**
 * 删除/批量删除当前用户的周报
 * url： /report/myReport/delete
 */
router.post('/myReport/delete', myReport.deleteMyReport);

/**
 * 获取当前用户所在组的本周周报
 * url： report/groupCurrentWeekReport/get
 */
router.post('/groupCurrentWeekReport/get', groupReport.getGroupCurrentWeekPort);

/**
 * 获取当前用户所在组的历史周报
 * url： report/groupHistoryWeekReport/get
 */
router.post('/groupHistoryWeekReport/get', groupReport.getGroupHistoryWeekPort);

/**
 * 获取当前用户所在组的历史周报
 * url： report/groupCurrentWeekReport/sendMail
 */
router.post('/groupCurrentWeekReport/sendMail', groupReport.sendReportMail);


module.exports = router;