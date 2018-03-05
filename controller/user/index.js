/**
 * Created by caoLiXin on 2018/3/2.
 */
const dbQuery = require('../../lib/mysql')

/**
 * 用户注册
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let register = async (ctx, next) => {
  try {
    let reqBody = ctx.request.body;
    const selectSql = 'SELECT * FROM user_info WHERE email = ?';
    let selectData = await dbQuery(selectSql, reqBody.email);

    if (selectData instanceof Array) {
      if (selectData.length !== 0) {
        ctx.body = {
          status: false,
          message: '该邮箱已注册！'
        }
      } else {
        const insertSql = 'INSERT INTO user_info VALUES (?,?,?,?,?,?)';
        let {email, name, sex, remark, groupId, password } = reqBody;
        let insertData = await dbQuery(insertSql, [email, name, sex, remark, groupId, password]);
        const updateSql = 'UPDATE group_info SET memberNum = memberNum + 1 WHERE id = ?';
        let updateData = await dbQuery(updateSql, reqBody.groupId);

        if (insertData.affectedRows === 1  && updateData.changedRows === 1) {
          ctx.body = {
            status: true,
            message: '注册成功，请登录！'
          }
        } else {
          ctx.body = {
            status: false,
            message: '注册失败，请重试！'
          }
        }
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: err
    }
  }
}

/**
 * 用户登录
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let login = async (ctx, next) => {
  const searchUid = 'SELECT * FROM user_info WHERE email = ?';
  try {
    let data = await dbQuery(searchUid, ctx.request.body.email);
    if (data instanceof Array && data.length !== 0) {
      if (data[0].password === ctx.request.body.password) {
        // 登录成功后设置cookie
        /* let option = {
          domain: 'localhost',
          expires: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),  // 有效期为一周
          overwrite: true
        }
        ctx.cookies.set('email', data[0].email, option)
        ctx.cookies.set('groupId', data[0].group, option) */
        ctx.session = {
          userId: data[0].email
        }
        delete data[0].password
        ctx.body = {
          status: true,
          data: data[0]
        }
      } else {
        ctx.body = {
          status: false,
          message: '密码有误！'
        }
      }
    } else {
      ctx.body = {
        status: false,
        message: '此用户不存在！'
      }
    }
  } catch (err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: err
    }
  }
}

/**
 * 更改密码
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let changePassword = async (ctx, next) => {
  const updateSQL = 'UPDATE user_info SET password = ? WHERE email = ?';
  try {
    let data = await dbQuery(updateSQL, [ctx.request.body.newPassword, ctx.session.userId])
    if (data.changedRows === 1) {
      ctx.body = {
        status: true,
        data: '密码更改成功，请重新登录！'
      }
    } else {
      ctx.body = {
        status: false,
        message: '密码修改失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: err
    }
  }
}

module.exports = {
  register,
  login,
  changePassword
}