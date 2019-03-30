/**
 * Created by caoLiXin on 2018/3/2.
 */
const dbQuery = require('../../lib/mysql');
const sendMail = require('../../common/utils/sendMail');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const path = require('path');
const config = require('../../config/default.js')

let readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../config/sysConfig.json'), 'utf8', (err, data) => {
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
          if (sysConfig.emailSuffix.indexOf(email.match(/@\w+/g)[0]) === -1) {
            ctx.body = {
              status: false,
              data: 'illegal-email-suffix'
            }
          } else {
            const insertEmailSql = 'INSERT INTO email_info (email, activeCode) VALUES (?, ?)';
            const activeCodeStr = uuidv1();
            let insertEmailData = await dbQuery(insertEmailSql, [email, activeCodeStr]);
            if (insertEmailData.affectedRows === 1) {
              const insertSql = 'INSERT INTO user_info (email, name, sex, remark, groupId, password) VALUES (?,?,?,?,?,?)';
              let insertData = await dbQuery(insertSql, [email, name, sex, remark, groupId, password]);
              const updateSql = 'UPDATE group_info SET memberNum = memberNum + 1, createTime = createTime WHERE id = ?';
              let updateData = await dbQuery(updateSql, reqBody.groupId);

              if (insertData.affectedRows === 1  && updateData.changedRows === 1) {
                let sendMailResult = await sendMail({
                  from: config.email.USERNAME,
                  to: email,
                  licenseKey: config.email.PASSWORD,
                  title: 'Sunflower周报管理平台账号激活邮件',
                  content: `<p>请点击以下链接激活您的账号：</p>
                  <a target="_blank" href="http://${ctx.host}/user/activeAccount/${activeCodeStr}">
                    http://${ctx.host}/user/activeAccount/${activeCodeStr}
                  </a>`
                });
                if (sendMailResult) {
                  ctx.body = {
                    status: true,
                    data: '注册成功！账号激活邮件已发送到您的注册邮箱，请尽快激活账号！'
                  }
                }
              } else {
                ctx.body = {
                  status: false,
                  data: '注册失败，请重试！'
                }
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
 * 重新发送激活邮件
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let resendActiveEmail = async (ctx, next) => {
  const activeCodeStr = uuidv1()
  const updateSql = 'UPDATE email_info SET activeCode = ? WHERE email = ?'
  try {
    let updateData = await dbQuery(updateSql, [activeCodeStr, ctx.request.body.email])
    if (updateData.affectedRows === 1){
      let sendMailResult = await sendMail({
        from: config.email.USERNAME,
        to: ctx.request.body.email,
        licenseKey: config.email.PASSWORD,
        title: 'Sunflower周报管理平台账号激活邮件',
        content: `<p>请点击以下链接激活您的账号：</p>
        <a target="_blank" href="http://${ctx.host}/user/activeAccount/${activeCodeStr}">
          http://${ctx.host}/user/activeAccount/${activeCodeStr}
        </a>`
      });
      if (sendMailResult) {
        ctx.body = {
          status: true,
          data: '账号激活邮件已发送到您的注册邮箱，请尽快激活账号！'
        }
      } else {
        ctx.body = {
          status: false,
          data: sendMailResult
        }
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
      data: '邮件发送失败，请重试！'
    }
  }
};

/**
 * 用户激活账号
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let activeAccount = async (ctx, next) => {
  const updateSql = "UPDATE email_info SET status = 'activated' WHERE activeCode = ?";
  try {
    let updateData = await dbQuery(updateSql, ctx.params.activeCode);
    let redirectUrl = String(ctx.origin)
    if (updateData.affectedRows === 1) {
      ctx.body = `<p style="text-align: center; margin-top: 50px; font-size: 18px;">账号已激活</p>
                  <p style="text-align: center; font-size: 18px;">正在跳转,请稍候...</p><script>window.setTimeout(function(){ window.open('${redirectUrl}', '_self'); }, 1500)</script>`
    } else {
      ctx.body = `<p style="text-align: center; margin-top: 50px; font-size: 18px;">账号激活失败</p>
                  <p style="text-align: center; font-size: 18px;">正在跳转,请稍候...</p><script>window.setTimeout(function(){ window.open('${redirectUrl}', '_self'); }, 1500)</script>`
    }
  } catch(err) {
    ctx.body = `<p style="text-align: center; margin-top: 50px; font-size: 18px;">账号激活失败</p>
                <p style="text-align: center; font-size: 18px;">正在跳转,请稍候...</p><script>window.setTimeout(function(){ window.open('${redirectUrl}', '_self'); }, 1500)</script>`
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
    // 判断是否注册
    let data = await dbQuery(searchUid, ctx.request.body.email);
    if (data instanceof Array && data.length !== 0) {
      // 注册了，判断是否是第一批无需注册便使用系统的用户
      const isExistSql = 'SELECT * FROM email_info WHERE email = ?';
      let isExistData = await dbQuery(isExistSql, ctx.request.body.email);
      // 是第一批无需注册便使用系统的用户
      if (isExistData instanceof Array && isExistData.length === 0) {
        // 将第一批用户新增入激活名单
        const activeCode = uuidv1()
        const insertEmailInfoSql = 'INSERT INTO email_info (email, status, activeCode) VALUES (?, ?, ?)';
        let insertEmailInfoData = await dbQuery(insertEmailInfoSql, [ctx.request.body.email, 'activated', activeCode]);
        if (insertEmailInfoData.affectedRows === 1) {
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
            data: '登录失败，请重试！'
          }
        }
      } else {// 非第一批老用户，需要判断账号是否激活
        // 已激活
        if (isExistData[0].status === 'activated') {
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
            data: 'unactivated'
          }
        }
      }
    } else {
      ctx.body = {
        status: false,
        data: '用户不存在！'
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
    const updateEmailInfoSql = 'UPDATE email_info SET licenseKey = ? WHERE email = ?';
    const updateSql = "UPDATE user_info SET name = ?, sex = ?, remark = ?, ordernum = ?, level = ? WHERE email = ?";

    let {name, sex, remark, ordernum, email, level} = ctx.request.body;
    let updateEmailInfoData = await dbQuery(updateEmailInfoSql, [ctx.request.body.licenseKey, email]);
    let updateData = await dbQuery(updateSql, [name, sex, remark, ordernum, level, email]);

    if (updateEmailInfoData.affectedRows === 1 && updateData.affectedRows === 1) {
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
  resendActiveEmail,
  activeAccount,
  userLogin,
  adminLogin,
  logOut,
  getUserInfo,
  changePassword,
  changUserInfo
};