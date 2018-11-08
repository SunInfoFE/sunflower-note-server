/**
 * Created by caoLiXin on 2018/3/5.
 */
const dbQuery = require('../../lib/mysql');

/**
 * 获取当前用户所有周报
 * 包括本周未提交/已提交周报、历史未提交/已提交周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getAll = async (ctx, next) =>  {
  try {
    const getAllSql = 'SELECT * FROM report_info WHERE email = ? ORDER BY createTime DESC';
    let getAllData = await dbQuery(getAllSql, ctx.session.userId);
    if (getAllData instanceof Array) {
      ctx.body = {
        status: true,
        data: getAllData
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
 * 删除/批量删除当前用户的所有周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let deleteMyReport = async (ctx, next) =>  {
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

module.exports = {
  getAll,
  deleteMyReport
};