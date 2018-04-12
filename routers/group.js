/**
 * Created by caoLiXin on 2018/3/2.
 */
const router = require('koa-router')();
let group = require('../controller/group/group.js')

router.prefix('/group')

// 获取所有小组列表
router.get('/groupManage/get', group.getAllGroupManage)

// 添加小组
router.post('/groupManage/add', group.addGroupManage)

// 编辑小组
router.post('/groupManage/edit', group.editGroupManage)

// 删除小组
router.post('/groupManage/delete', group.delGroupManage)

// 查看小组内所有成员
router.get('/groupManage/getGroupMember', group.getGroupMember)

// 删除组内人员
router.post('/groupManage/deleteGroupMember', group.delGroupMember)

// 移动组内人员到另一组
router.post('/groupManage/moveGroupMember', group.moveUser)

module.exports = router