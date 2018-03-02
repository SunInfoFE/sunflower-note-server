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
    let selectSql = 'SELECT * FROM user_info WHERE email = ?';
    let selectData = await dbQuery(selectSql, reqBody.email);

    if (selectData instanceof Array) {
      if (selectData.length !== 0) {
        ctx.body = {
          status: false,
          message: '该邮箱已注册！'
        }
      } else {
        let insertSql = 'INSERT INTO user_info VALUES (?,?,?,?,?,?)';
        let insertData = await dbQuery(insertSql, [reqBody.email, reqBody.name, reqBody.sex, reqBody.remark, reqBody.group, reqBody.password]);

        if (insertData instanceof Array && insertData.length !== 0) {
          ctx.body = {
            status: true,
            message: '注册成功，请登录！'
          }
        }
      }
    }
  } catch(err) {
    console.log(`[POST '/user/register' ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      message: '注册失败，请重试！'
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
  let searchUid = `SELECT email,name,sex,remark,group FROM user_info WHERE email = ?`;
  try {
    let data = await dbQuery(searchUid, ctx.request.body.email)
    if (data instanceof Array && data.length !== 0) {
      if (data[0].password === ctx.request.body.password) {
        // 登录成功后设置cookie
        ctx.cookies.set('userInfo', {
          email: data[0].email
        }, {
          domain: 'localhost',
          expires: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000),  // 有效期为一周
          overwrite: true
      })
        ctx.body = {
          status: true,
          data: data
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
    console.log(`[POST '/user/login' ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      message: '登录失败，请重试！'
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
  let updateSQL = 'UPDATE user_info SET password = ? WHERE email = ?';
  try {
    let data = await dbQuery(updateSQL, [ctx.request.body.newPassword, ctx.cookies.get('email').email])
    if (data instanceof Array && data.length !== 0) {
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
    console.log(`[POST '/user/changPassword' ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      message: '密码修改失败，请重试！'
    }
  }
}

module.exports = {
  register,
  login,
  changePassword
}