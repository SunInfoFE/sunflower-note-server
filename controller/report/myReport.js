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
    const getAllSql = 'SELECT * FROM report_info WHERE email = ?';
    let getAllData = await dbQuery(getAllSql, ctx.ssession.userId);
    if (getAllData instanceof Array && getAllData.length !== 0) {
      ctx.body = {
        status: true,
        data: getAllData
      }
    } else {
      ctx.body = {
        status: false,
        data: '获取数据失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: err
    }
  }
};

module.exports = {
  getAll
}