/**
 * Created by caoLiXin on 2018/3/2.
 */
const router = require('koa-router')();
let group = require('../controller/group/group.js')

router.prefix('/group')

// 获取所有用户列表
router.get('/groupManage/get', async (ctx, next) => {
    await group.getAllGroupManage(ctx, next)
})

// 添加小组
router.post('/groupManage/add', async (ctx, next) => {
    await group.addGroupManage(ctx, next)
})

// 编辑小组
router.post('/groupManage/edit', async (ctx, next) => {
    await group.editGroupManage(ctx, next)
})

// 删除小组
router.post('/groupManage/delete', async (ctx, next) => {
    await group.delGroupManage(ctx, next)
})

// 查看小组内所有成员
router.get('/groupManage/getGroupMember', async(ctx, next) => {
    await group.getGroupMember(ctx, next)
})

// 删除组内人员
router.post('/groupManage/deleteGroupMember', async(ctx, next) => {
    await group.delGroupMember(ctx, next)
})
module.exports = router