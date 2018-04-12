/**
 * Created by caoLiXin on 2018/4/12.
 */
const dbQuery = require('../../lib/mysql');

/**
 * 新增发送邮件人员
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let add = async (ctx, next) => {
  const addSql = 'INSERT INTO sendMail_info (email, name) VALUES (?, ?)';
  const isExistSql = 'SELECT * FROM sendMail_info WHERE email = ?'
  let {email, name} = ctx.request.body
  try {
    let isExistData = await dbQuery(isExistSql, email);
    if (isExistData instanceof Array && isExistData.length > 0) {
      ctx.body = {
        status: false,
        data: '该邮箱已添加，请勿重复添加！'
      }
    } else {
      let addData = await dbQuery(addSql, [email, name]);
      if (addData.affectedRows === 1) {
        ctx.body = {
          status: true,
          data: '新增成功！'
        }
      } else {
        ctx.body = {
          status: false,
          data: addData
        }
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '新增失败，请重试！'
    }
  }
};

/**
 * 删除邮件发送人员
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let del = async (ctx, next) => {
  const delSql = `DELETE FROM sendMail_info WHERE id IN ( ${ctx.request.body.idList} )`;
  try {
    let delData = await dbQuery(delSql);
    if (delData.affectedRows > 0) {
      ctx.body = {
        status: true,
        data: '删除成功！'
      }
    } else {
      ctx.body = {
        status: false,
        data: delData
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '删除失败，请重试！'
    }
  }
};

/**
 * 获取邮件发送人员
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let get = async (ctx, next) => {
  const getSql = 'SELECT * FROM sendMail_info';
  try {
    let getData = await dbQuery(getSql);
    if (getData instanceof Array) {
      ctx.body = {
        status: true,
        data: getData
      }
    } else {
      ctx.body = {
        status: false,
        data: getData
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '获取数据失败，请重试！'
    }
  }
};

/**
 * 编辑更新邮件发送人员
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let update = async (ctx, next) => {
  const updateSql = 'UPDATE sendMail_info SET email = ?, name = ? WHERE id = ?';
  try {
    let {email, name, id} = ctx.request.body;
    let updateData = await dbQuery(updateSql, [email, name, id]);
    if (updateData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: '更新成功！'
      }
    } else {
      ctx.body = {
        status: false,
        data: updateData
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '更新失败，请重试！'
    }
  }
};

module.exports = {
  add,
  del,
  get,
  update
}