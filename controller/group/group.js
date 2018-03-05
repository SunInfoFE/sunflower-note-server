/**
 * Created by huog on 2018/3/2
 */
const query = require('../../lib/mysql.js');
// 获取所有小组列表
let getAllGroupManage = async (ctx, next) => {
  let sql = `SELECT * FROM group_info`
  try {
    let groupInfo =  await query(sql)
    if (groupInfo instanceof Array) {
      ctx.body = {
        status: true,
        data: groupInfo
      }
    }
  } catch (err) {
    console.log(`[GET '/groupManage/get' ERROR] -- ${err}`)
    ctx.body = {
      status: false,
      data: '查询失败'
    }
  }
}

// 添加小组
let addGroupManage = async (ctx, next) => {
  /**
   * {
    name: '组名',
    remark: '备注（小组信息）'
}
   */
  let group = {
    name: ctx.request.body.name,
    remark: ctx.request.body.remark
  }
  // 不能添加名称相同的小组
  let searchSql = `SELECT * FROM group_info WHERE name=?`
  try {
    let nameRepeat = await query(searchSql, [group.name])
    if (nameRepeat instanceof Array && nameRepeat.length > 0) {
      ctx.body = {
        status: false,
        data: '小组名已存在'
      }
    } else {
      let sql = `INSERT INTO group_info (name,remark) VALUES (?,?);`
      try {
        await query(sql, [group.name, group.remark])
        ctx.body = {
          status: true,
          data: '新增成功'
        }
      } catch (err) {
        console.log(`[GET '/groupManage/add' ERROR] -- ${err}`)
        ctx.body = {
          status: false,
          data: '新增失败'
        }
      }
    }
  } catch (err) {
    console.log(`[GET '/groupManage/add' ERROR] -- ${err}`)
  }
}

// 编辑小组
let editGroupManage = async (ctx, next) => {
  /**
   * {
    id: 小组ID,
    name: '小组名'
    remark: '备注（小组信息）'
}
   */
  let group = {
    id: ctx.request.body.id,
    name: ctx.request.body.name,
    remark: ctx.request.body.remark
  }
  let searchSql = `SELECT * FROM group_info WHERE name=?`
  try {
    let nameRepeat = await query(searchSql, [group.name])
    if (nameRepeat instanceof Array && nameRepeat.length > 0) {
      ctx.body = {
        status: false,
        data: '小组名已存在'
      }
    } else {
      let sql = `UPDATE group_info SET name=?, remark=?
             WHERE id=?`
      try {
        await query(sql, [group.name,group.remark,group.id])
        ctx.body = {
          status: true,
          data: '编辑成功'
        }
      } catch (err) {
        console.log(`[GET '/groupManage/edit' ERROR] -- ${err}`)
        ctx.body = {
          status: false,
          data: '编辑失败'
        }
      }
    }
  } catch (err) {
    console.log(`[GET '/groupManage/edit' ERROR] -- ${err}`)
  }
}

// 删除小组
let delGroupManage = async (ctx, next) => {
  /**
   * {
       idList: [id1, id2, ...]
     }
   */
  // 不能删除含有成员的小组
  let idList = ctx.request.body.idList
  let sql = `DELETE FROM group_info WHERE id=?;`
  let memberSql = `SELECT * FROM user_info WHERE groupId=?;`
  if (idList instanceof Array && idList.length > 0) {
    for (let id of idList) {
      try {
        let isEmpty = await query(memberSql, [id])
        if (!isEmpty.length) {
          try {
            await query(sql, [id])
            ctx.body = {
              status: true,
              data: '删除成功'
            }
          } catch (err) {
            console.log(`[GET '/groupManage/delete' ERROR] -- ${err}`)
            ctx.body = {
              status: false,
              data: '删除失败'
            }
          }
        } else {
          ctx.body = {
            status: false,
            data: '小组人员不为空无法删除'
          }
        }
      } catch (err) {
        console.log(`[GET '/groupManage/delete' ERROR] -- ${err}`)
      }
    }
  }
}

// 查看小组内所有成员
let getGroupMember = async (ctx, next) => {
  /**
   * {
       id: 小组ID
     }
   */
  let id = ctx.request.query.id
  let sql = `SELECT * FROM user_info WHERE groupId=?;`
  try {
    let groupMemberInfo = await query(sql, id)
    if (groupMemberInfo instanceof Array) {
      ctx.body = {
        status: true,
        data: groupMemberInfo
      }
    }
  } catch (err) {
    console.log(`[GET '/groupManage/getGroupMember' ERROR] -- ${err}`)
    ctx.body = {
      status: false,
      data: '查询小组成员失败'
    }
  }
}

// 删除组内成员
let delGroupMember = async (ctx, next) => {
  /**
   *
   * {
       idList: [id1, id2, ...]
     }
   */
  let idList = ctx.request.body.idList
  let sql = `DELETE FROM user_info WHERE email=?;`
  // 后期根据业务：可能需要根据继续删除其对应的周报
  if (idList instanceof Array && idList.length > 0) {
    for (let id of idList) {
      try {
        await query(sql, [id])
        ctx.body = {
          status: true,
          data: '删除成功'
        }
      } catch (err) {
        console.log(`[GET '/groupManage/deleteGroupMember' ERROR] -- ${err}`)
        ctx.body = {
          status: false,
          data: '删除失败'
        }
      }
    }
  }
}
module.exports = {
  getAllGroupManage,
  addGroupManage,
  editGroupManage,
  delGroupManage,
  getGroupMember,
  delGroupMember
}