/**
 * Created by caoLiXin on 2018/3/13.
 */
const dbQuery = require('../../lib/mysql');
const getMonday = require('../../common/utils/getMonday');

/**
 * 获取本周所有工作日志
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getAll = async (ctx, next) => {
  const getSql = 'SELECT * FROM journal_info WHERE email = ? AND week = ?'
  try {
    let getData = await dbQuery(getSql, [ctx.session.userId, getMonday()]);
    if (getData instanceof Array) {
      ctx.body = {
        status: true,
        data: getData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: false,
      data: err.message
    }
  }
};


/**
 * 新增本周工作日志
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let add = async (ctx, next) => {
  const addSql = 'INSERT INTO journal_info (task, email, week) VALUES (?, ?, ?, ?)';
  try {
    let addData = await dbQuery(addSql, [ctx.request.body.task, ctx.session.userId, getMonday()]);
    if (addData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: '新增成功！'
      }
    } else {
      ctx.status = 500;
      ctx.body = {
        status: true,
        data: addData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: true,
      data: err.message
    }
  }
};


/**
 * 编辑本周工作日志
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let edit = async (ctx, next) => {
  const editSql = 'UPDATE journal_info SET task = ?, createTime = createTime WHERE id = ?';
  try {
    let editData = await dbQuery(editSql, [ctx.request.body.task, ctx.request.body.id]);
    if (editData.changedRows === 1) {
      ctx.body = {
        status: true,
        data: '编辑成功！'
      }
    } else {
      ctx.status = 500;
      ctx.body = {
        status: true,
        data: editData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: true,
      data: err.message
    }
  }
};

/**
 * 修改工作日志状态 status
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let changeStatus = async (ctx, next) => {
  const changeSql = 'UPDATE journal_info SET status = ?, createTime = createTime WHERE id = ?';
  try {
    let changeData = await dbQuery(changeSql, [ctx.request.body.status, ctx.request.body.id]);
    if (changeData.changedRows === 1) {
      ctx.body = {
        status: true,
        data: '状态更改成功！'
      }
    } else {
      ctx.status = 500;
      ctx.body = {
        status: true,
        data: changeData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: true,
      data: err.message
    }
  }
};


/**
 * 将所选'工作记录'形成的预览周报，保存为周报草稿
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let saveDraft = async (ctx, next) => {
  try {
    const saveSql = "INSERT INTO report_info (title, summary, plan, week, email, groupId) SELECT ?, ?, ?, ?, ?, groupId FROM user_info WHERE email = ?"
    let {title, summary, plan} = ctx.request.body;
    let saveData = await dbQuery(saveSql, [title, summary, plan, getMonday(), ctx.session.userId, ctx.session.userId]);
    if (saveData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: '保存成功，可在"我的周报"中查看！"'
      }
    } else {
      ctx.body = {
        status: false,
        data: saveData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: false,
      data: err.message
    }
  }
};


/**
 * 将所选'工作记录'形成的预览周报，直接提交至小组周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let submitDraft = async (ctx, next) => {
  const changeSql = "UPDATE report_info SET status = 'private' WHERE email = ? AND week = ? AND status = 'public'";
  try {
    let changeData = await dbQuery(changeSql, [ctx.session.userId, getMonday()]);
    if (changeData) {
      const saveSql = "INSERT INTO report_info (title, summary, plan, week, email, groupId) SELECT ?, ?, ?, ?, ?, groupId FROM user_info WHERE email = ?"
      let {title, summary, plan} = ctx.request.body;
      let saveData = await dbQuery(saveSql, [title, summary, plan, getMonday(), ctx.session.userId, ctx.session.userId]);
      if (saveData.affectedRows === 1) {
        ctx.body = {
          status: true,
          data: '提交成功'
        }
      } else {
        ctx.body = {
          status: false,
          data: saveData
        }
      }
    } else {
      ctx.body = {
        status: false,
        data: changeData
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.status = 500;
    ctx.body = {
      status: false,
      data: err.message
    }
  }
};


module.exports = {
  getAll,
  add,
  edit,
  changeStatus,
  saveDraft,
  submitDraft
}
