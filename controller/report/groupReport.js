/**
 * Created by liushupeng on 2018/3/7.
 */
const dbQuery = require('../../lib/mysql');
const getMonday = require('../../common/utils/getMonday');
const sendMail = require('../../common/utils/sendMail');

/**
 * 获取当前用户所在小组的本周周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getGroupCurrentWeekPort = async (ctx, next) =>  {
  try {
    // const selectSql = 'SELECT groupId FROM user_info WHERE email = ?';
    // let selectGroupId = await dbQuery(selectSql, ctx.session.userId);
    const selectReportSql = "select r.*, u.* from report_info as r join user_info as u on r.email = u.email where u.groupId = (select groupId from user_info where user_info.email = ?) and r.status = 'public' and week = ?";
    let groupCurrentReport = await dbQuery(selectReportSql, [ctx.session.userId, getMonday()]);
    if (groupCurrentReport instanceof Array) {
      ctx.body = {
        status: true,
        data: groupCurrentReport
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
 * 获取需要集中周报小组的本周周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getCollectGroupCurrentWeekPort = async (ctx, next) =>  {
  try {
    let combine = ctx.request.body.collector;
    const selectReportSql = "select r.*, u.* from report_info as r join user_info as u on r.email = u.email where u.groupId IN (select id from group_info where combine = ?) and r.status = 'public' and week = ?";
    let groupCurrentReport = await dbQuery(selectReportSql, [combine,getMonday()]);
    if (groupCurrentReport instanceof Array) {
      ctx.body = {
        status: true,
        data: groupCurrentReport
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
 * 获取当前用户所在小组的历史周报
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let getGroupHistoryWeekPort = async (ctx, next) =>  {
  try {
    const selectReportSql = "select r.*, u.* from report_info as r join user_info as u on r.email = u.email where u.groupId = (select groupId from user_info where user_info.email = ?) and r.status = 'public' and week != ?";
    let groupHistoryReport = await dbQuery(selectReportSql, [ctx.session.userId, getMonday()]);
    if (groupHistoryReport instanceof Array) {
      ctx.body = {
        status: true,
        data: groupHistoryReport
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
 * 发送小组周报邮件
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let sendReportMail = async (ctx, next) =>{
  const selectLicenseKeySql = 'SELECT * from email_info WHERE email = ?';
  try {
    let selectLicenseKeyData = await dbQuery(selectLicenseKeySql, ctx.session.userId);

    if (selectLicenseKeyData[0].status === 'unactivated') {
      ctx.body = {
        status: false,
        data: '您的账号未激活！'
      }
    } else {
      if (!selectLicenseKeyData[0].licenseKey) {
        ctx.body = {
          status: false,
          data: '您未设置邮箱密码/授权码！'
        }
      } else {
        let licenseKey = selectLicenseKeyData[0].licenseKey
        let {to, cc, title, content} = ctx.request.body
        let sendResult = await sendMail({
          from: ctx.session.userId,
          to: to.join(','),
          cc: cc.join(','),
          licenseKey: licenseKey,
          title: title,
          content: content
        })
        if (sendResult) {
          ctx.body = {
            status: true,
            data: '邮件已发送，您可登录邮箱查看！'
          }
        }
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: '邮件发送失败失败，请重试！'
    }
  }
}


module.exports = {
  getGroupCurrentWeekPort,
  getCollectGroupCurrentWeekPort,
  getGroupHistoryWeekPort,
  sendReportMail
}