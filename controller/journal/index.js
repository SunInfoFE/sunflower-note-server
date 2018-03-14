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
let get = async (ctx, next) => {
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
 * 将所选'工作记录'形成的预览周报，保存为周报草稿
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let saveDraft = async (ctx, next) => {
  try {
    const saveSql = "INSERT INTO report_info (title, summary, plan, week, email, groupId) SELECT ?, ?, ?, ?, ?, groupId FROM user_info WHERE email = ?"
    let {title, summary, plan} = ctx.request.body;
    let saveData = await dbQuery(saveSql, ['未命名周报', summary, '计划', getMonday(), ctx.session.userId, ctx.session.userId]);
    if (saveData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: saveData
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
};


module.exports = {
  get,
  saveDraft,
  submitDraft
}
