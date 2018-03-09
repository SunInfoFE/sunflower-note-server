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
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '查询失败，请重试！'
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
  let {name, remark} = ctx.request.body
  // 不能添加名称相同的小组
  let searchSql = `SELECT * FROM group_info WHERE name=?`
  try {
    if (name !== (undefined || '') && remark !== undefined) {
      let nameRepeat = await query(searchSql, [name])
      if (nameRepeat instanceof Array && nameRepeat.length > 0) {
        ctx.body = {
          status: false,
          data: '小组名已存在！'
        }
      } else {
        let sql = `INSERT INTO group_info (name,remark) VALUES (?,?);`
        let insertGroup = await query(sql, [name, remark])
        if (insertGroup.affectedRows === 1) {
          ctx.body = {
            status: true,
            data: '新增成功'
          }
        } else {
          ctx.body = {
            status: false,
            data: '新增失败，请重试！'
          }
        }
      }
    } else {
      ctx.status = 500
    }
  } catch (err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '新增失败，请重试！'
    }
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
  try {
    let {id, name, remark} = ctx.request.body
    let searchSql = `SELECT * FROM group_info WHERE name=?`
    if (id !== (undefined || '') && name !== (undefined || '') && remark !== undefined) {
      let nameRepeat = await query(searchSql, [name])
      if (nameRepeat instanceof Array && nameRepeat.length > 1) {
        ctx.body = {
          status: false,
          data: '小组名已存在'
        }
      } else {
        let sql = `UPDATE group_info SET name=?, remark=?
             WHERE id=?`
        let updateSql = await query(sql, [name, remark, id])
        console.log(updateSql)
        if (updateSql.affectedRows === 1) {
          ctx.body = {
            status: true,
            data: '编辑成功'
          }
        } else {
          ctx.body = {
            status: false,
            data: '编辑失败，请重试！'
          }
        }
      }
    } else {
      ctx.status = 500
    }
  } catch (err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '编辑失败，请重试！'
    }
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
  let sql = `DELETE FROM group_info WHERE id IN ('${idList}');`
  let memberSql = `SELECT * FROM user_info WHERE groupId IN ('${idList}');`
  if (idList instanceof Array && idList.length > 0) {
    try {
      let isEmpty = await query(memberSql)
      if (isEmpty.length === 0) {
        let deleteSql = await query(sql)
        if (deleteSql.affectedRows > 0) {
          ctx.body = {
            status: true,
            data: '删除成功！'
          }
        } else {
          ctx.body = {
            status: false,
            data: '删除失败，请重试！'
          }
        }
      } else {
        ctx.body = {
          status: false,
          data: '小组人员不为空无法删除！'
        }
      }
    } catch (err) {
      console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
      ctx.body = {
        status: false,
        data: '删除失败，请重试！'
      }
    }
  } else {
    ctx.status = 400
  }
}

// 查看小组内所有成员
let getGroupMember = async (ctx, next) => {
  /**
   * {
       id: 小组ID
     }
   */
  let sql = `SELECT * FROM user_info WHERE groupId=?;`
  try {
    let id = ctx.request.query.id
    let groupMemberInfo = await query(sql, id)
    if (groupMemberInfo instanceof Array) {
      ctx.body = {
        status: true,
        data: groupMemberInfo
      }
    }
  } catch (err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '查询小组成员失败，请重试！'
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
  try {
    let idList = ctx.request.body.idList
    let sql = `DELETE FROM user_info WHERE email IN ( '${idList}' );`
    let updateSql = `UPDATE group_info SET memberNum = (memberNum - 1)  WHERE id  = ${ctx.query.id};`
    // 后期根据业务：可能需要根据继续删除其对应的周报
    if (idList instanceof Array && idList.length > 0) {
      let update = await query(updateSql)
      let deleteSql = await query(sql)
      if (update.affectedRows === 1 && deleteSql.affectedRows === 1) {
        ctx.body = {
          status: true,
          data: '删除成功'
        }
      } else {
        ctx.body = {
          status: false,
          data: '删除失败，请重试！'
        }
      }
    } else {
      ctx.status = 500
    }
  } catch (err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '删除失败，请重试！'
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