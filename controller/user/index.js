/**
 * Created by caoLiXin on 2018/3/2.
 */
const dbQuery = require('../../lib/mysql');
const fs = require('fs');

let readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('config/sysConfig.json', 'utf8', (err, data) => {
      if (err) {
        reject (err)
      } else {
        resolve(data)
      }
    });
  })
}

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
          data: '该邮箱已注册！'
        }
      } else {
        let {email, name, sex, remark, groupId, password } = reqBody;
        let sysData = await readConfig();

        if (sysData) {
          let sysConfig = JSON.parse(sysData);
          console.log(sysConfig, email.match(/@\w+/g))
          if (sysConfig.emailSuffix.indexOf(email.match(/@\w+/g)[0]) === -1) {
            ctx.body = {
              status: false,
              data: 'illegal-email-suffix'
            }
          } else {
            const insertSql = 'INSERT INTO user_info (email, name, sex, remark, groupId, password) VALUES (?,?,?,?,?,?)';
            let insertData = await dbQuery(insertSql, [email, name, sex, remark, groupId, password]);
            const updateSql = 'UPDATE group_info SET memberNum = memberNum + 1 WHERE id = ?';
            let updateData = await dbQuery(updateSql, reqBody.groupId);

            if (insertData.affectedRows === 1  && updateData.changedRows === 1) {
              ctx.body = {
                status: true,
                data: '注册成功，请登录！'
              }
            } else {
              ctx.body = {
                status: false,
                data: '注册失败，请重试！'
              }
            }
          }
        } else {
          ctx.body = {
            status: false,
            data: sysData
          }
        }
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '注册失败，请重试！'
    }
  }
};

/**
 * 普通用户登录
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let userLogin = async (ctx, next) => {
  const searchUid = 'SELECT * FROM user_info WHERE email = ?';
  try {
    let data = await dbQuery(searchUid, ctx.request.body.email);
    if (data instanceof Array && data.length !== 0) {
      if (data[0].password === ctx.request.body.password) {
        // 登录成功后设置session
        ctx.session = {
          userId: data[0].email
        };
        delete data[0].password;
        ctx.body = {
          status: true,
          data: data[0]
        }
      } else {
        ctx.body = {
          status: false,
          data: '密码有误！'
        }
      }
    } else {
      ctx.body = {
        status: false,
        data: '此用户不存在！'
      }
    }
  } catch (err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '登录失败，请重试！'
    }
  }
};

/**
 * 管理员登录接口
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let adminLogin = async (ctx, next) => {
  try {
    const loginSql = "SELECT * FROM user_info WHERE email = ? AND role = 'admin'";
    let loginData = await dbQuery(loginSql, ctx.request.body.email);
    if (loginData instanceof Array && loginData.length !== 0) {
      if (loginData[0].password === ctx.request.body.password) {
        ctx.session = {
          userId: loginData[0].email
        };
        delete loginData[0].password;
        ctx.body = {
          status: true,
          data: loginData[0]
        }
      } else {
        ctx.body = {
          status: false,
          data: '密码有误！'
        }
      }
    } else {
      ctx.body = {
        status: false,
        data: '此管理员用户不存在！'
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '登录失败，请重试！'
    }
  }
};

/**
 * 获取用户信息和所属组
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getUserInfo = async (ctx, next) => {
  try {
    const getSql = "SELECT u.*,g.name as groupName from user_info u LEFT JOIN group_info g ON u.groupId = g.id WHERE u.email = ?";
    let getData = await dbQuery(getSql, ctx.session.userId);
    if (getData instanceof Array) {
      delete getData[0].password;
      ctx.body = {
        status: true,
        data: getData
      }
    } else {
      ctx.body = {
        status: false,
        data: '数据获取失败，请重试！'
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '登录失败，请重试！'
    }
  }
};

/**
 * 更改密码
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let changePassword = async (ctx, next) => {
  try {
    const checkSql = "SELECT password FROM user_info WHERE email = ?";
    let checkData = await dbQuery(checkSql, ctx.session.userId);
    if (ctx.request.body.oldPassword === checkData[0].password) {
      const updateSQL = 'UPDATE user_info SET password = ? WHERE email = ?';
      let data = await dbQuery(updateSQL, [ctx.request.body.newPassword, ctx.session.userId]);
      if (data.affectedRows === 1) {
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
    } else {
      ctx.body ={
        status: false,
        data: '原密码有误！'
      }
    }
  } catch(err) {
    console.log(`[${ctx.method} - ${ctx.url} ERROR] -- ${err}`);
    ctx.body = {
      status: false,
      data: '密码修改失败，请重试！'
    }
  }
};

/**
 * 更新个人信息
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let changUserInfo = async (ctx, next) => {
  try {
    const updateSql = "UPDATE user_info SET name = ?, sex = ?, remark = ? WHERE email = ?";
    let {name, sex, remark} = ctx.request.body;
    let updateData = await dbQuery(updateSql, [name, sex, remark, ctx.session.userId]);
    if (updateData.affectedRows === 1) {
      ctx.body = {
        status: true,
        data: '更新成功！'
      }
    } else {
      ctx.body = {
        status: false,
        data: '更新失败，请重试！'
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

/**
 * 注销/退出系统
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let logOut = async (ctx, next) => {
  try {
    ctx.session = null;
    ctx.body = {
      status: true,
      data: '系统已退出！'
    }
  } catch(err) {
    ctx.body = {
      status: true,
      data: '退出失败，请重试！'
    }
  }
};

module.exports = {
  register,
  userLogin,
  adminLogin,
  logOut,
  getUserInfo,
  changePassword,
  changUserInfo
};