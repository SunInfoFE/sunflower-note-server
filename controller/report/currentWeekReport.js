/**
 * Created by caoLiXin on 2018/2/28.
 */
const dbQuery = require('../../lib/mysql');
const getMonday = require('../../common/utils/getMonday');

/**
 * 获取当前用户所有本周周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getAll = async (ctx, next) =>  {
  try {
    const selectSql = 'SELECT * FROM report_info WHERE email = ? AND week =?';
    let selectData = await dbQuery(selectSql, [ctx.ssession.userId, getMonday()]);
    if (selectData instanceof Array) {
      ctx.body = {
        status: true,
        data: selectData
      }
    } else {
      ctx.body = {
        status: false,
        data: '数据获取失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '数据获取失败，请重试！'
    }
  }
};

/**
 * 新增周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let add = async (ctx, next) => {
  try {
    const addSql = 'INSERT INTO report_info (title, summary, plan, week, email) VALUES (?,?,?,?,?)';
    let {title, summary, plan} = ctx.request.body
    let addData = await dbQuery(addSql, [title, summary, plan, getMonday(), ctx.ssession.userId]);
    if (addData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: '新增成功！'
      }
    } else {
      ctx.body = {
        status: false,
        data: '新增失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '新增失败，请重试！'
    }
  }
};

/**
 * 编辑周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let edit = async (ctx, next) => {
  try {
    let editSql = 'UPDATE report_info SET title = ?, summary = ?, plan = ?, createTime = createTime, lastUpdateTime = ? WHERE id = ?';
    let {title, summary, plan, id} = ctx.request.body;
    let editData = await dbQuery(editSql, [title, summary, plan, new Date(), id]);
    if (editData.changedRows === 1) {
      ctx.body = {
        status: true,
        data: '编辑成功！'
      }
    } else {
      ctx.body = {
        status: false,
        data: '编辑失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '编辑失败，请重试！'
    }
  }
};

/**
 * 删除/批量删除周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 * @private
 */
let _delete = async (ctx, next) => {
  try {
    let deleteSql = `DELETE FROM report_info WHERE id IN ( ${ctx.request.body.idList} )`;
    let deleteData = await dbQuery(deleteSql);
    if (deleteData.affectedRows > 0) {
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
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '删除失败，请重试！'
    }
  }
};

/**
 * 提交周报（将本周的一篇周报笔记提交至小组周报）
 * sql操作： report表中 status 'private' -> 'public'
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let submit = async (ctx, next) => {
  try {
    const checkSql = "SELECT COUNT(*) AS count FROM report_info WHERE email = ? AND week = ? AND status = 'public'";
    let checkData = await dbQuery(checkSql, [ctx.request.body.email, getMonday()]);
    console.log(checkData)
    if (checkData[0].count !== 0) {
      ctx.body = {
        status: false,
        data: '您本周的周报已提交，请勿重复提交！'
      }
    } else {
      const submitSql = "UPDATE report_info SET status = 'public' WHERE id = ?";
      let submitData = await dbQuery(submitSql, ctx.request.body.id);
      if (submitData.changedRows === 1) {
        ctx.body = {
          status: true,
          data: '提交成功！'
        }
      } else {
        ctx.body = {
          status: false,
          data: '提交失败，请重试！'
        }
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '提交失败，请重试！'
    }
  }
};

module.exports = {
  getAll,
  add,
  edit,
  _delete,
  submit
};