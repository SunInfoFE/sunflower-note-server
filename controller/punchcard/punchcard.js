const query = require('../../lib/mysql.js');

// 签到
let signin = async (ctx, next) => {
    /**
     * card_status 1 : 签到 2： 请假
     */
    let {userid} = ctx.request.body

    let searchSql = `SELECT * FROM punch_card WHERE userid=? and card_time=?`
    try {
        if (userid !== (undefined || '')) {
            let date = new Date();
            let monthStr = String(date.getMonth() + 1);
            let month = monthStr.length === 1 ? '0' + monthStr : monthStr;
            let dayStr = String(date.getDate());
            let day = dayStr.length === 1 ? '0' + dayStr : dayStr;
            let card_time = date.getFullYear() + "-" + month + "-" + day;
            let isSign = await query(searchSql, [userid,card_time])
            if (isSign instanceof Array && isSign.length > 0) {
                ctx.body = {
                    status: false,
                    data: '已经签到！'
                }
            } else {
                let sql = `INSERT INTO punch_card (userid,card_time,card_status) VALUES (?,?,?);`
                let card_status = 1;
                let insertGroup = await query(sql, [userid, card_time,card_status])
                if (insertGroup.affectedRows === 1) {
                    ctx.body = {
                        status: true,
                        data: '签到成功！'
                    }
                } else {
                    ctx.body = {
                        status: false,
                        data: '签到失败，请重试！'
                    }
                }
            }
        } else {
            ctx.status = 500
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '签到失败，请重试！'
        }
    }
}
/**
 * 用户所有签到和未签到的列表
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
let userList = async (ctx, next) => {
    /**
     * card_status 1 : 签到
     */
    let {userid} = ctx.request.body

    let searchSql = `SELECT card_time,card_status FROM punch_card WHERE userid=?`
    try {
        if (userid !== (undefined || '')) {
            let isSign = await query(searchSql, [userid])
            if (isSign instanceof Array && isSign.length > 0) {
                ctx.body = {
                    status: true,
                    data: isSign
                }
            } else {
                ctx.body = {
                    status: true,
                    data: []
                }
            }
        } else {
            ctx.status = 500
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '操作失败，请重试！'
        }
    }
}

let allList = async (ctx, next) => {
    let searchSql = `SELECT userid,card_time,card_status FROM punch_card`
    try {
        let isSign = await query(searchSql)
        if (isSign instanceof Array && isSign.length > 0) {
            ctx.body = {
                status: true,
                data: isSign
            }
        } else {
            ctx.body = {
                status: true,
                data: []
            }
        }

    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '操作失败，请重试！'
        }
    }
}

// 获取某个level的成员
let getLevelMember = async (ctx, next) => {
    /**
     * {
         id: 小组ID
       }
     */
    let sql = `SELECT email,name,sex FROM user_info WHERE level=?;`
    try {
      let id = ctx.request.body.id;
      let groupMemberInfo = await query(sql, id)
      if (groupMemberInfo instanceof Array) {
        groupMemberInfo.forEach((item, index) => {
          delete item.password
        })
        ctx.body = {
          status: true,
          data: groupMemberInfo
        }
      }
    } catch (err) {
      console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
      ctx.body = {
        status: false,
        data: '查询失败，请重试！'
      }
    }
  };

// 设置某个人的level
let setLevelMember = async (ctx, next) => {
    try {
        const querySql = 'SELECT email,name,sex FROM user_info WHERE email = ?';
        let groupMemberInfo = await query(querySql, ctx.request.body.userEmail)
        if (groupMemberInfo instanceof Array && groupMemberInfo.length === 1) {
            const updateInfoSql = 'UPDATE user_info SET level = ? WHERE email = ?';
            let updateInfoSqlData = await query(updateInfoSql, [ctx.request.body.level, ctx.request.body.userEmail]);
            if (updateInfoSqlData.affectedRows === 1) {
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
        } else {
            ctx.body = {
                status: false,
                data: '更新失败，未找到用户！'
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

//当月列表
let monthList = async (ctx, next) => {
    let {month} = ctx.request.body;
    let searchSql = "SELECT userid,card_time,card_status FROM punch_card where card_time LIKE " + "'" + month + "%'"
    console.log(searchSql);
    try {

        //let mons = date.getFullYear()+"-"+(date.getMonth()+1)+"%"
        let isSign = await query(searchSql)
        if (isSign instanceof Array && isSign.length > 0) {
            console.log(isSign);
            ctx.body = {
                status: true,
                data: isSign
            }
        } else {
            ctx.body = {
                status: true,
                data: []
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '操作失败，请重试！'
        }
    }
}

//当月某用户列表
let userMonthList = async (ctx, next) => {
    let {userid, month} = ctx.request.body;
    let searchSql = "SELECT userid,card_time,card_status FROM punch_card where card_time LIKE " + "'" + month + "%'" + " and userid=?"
    try {
        let isSign = await query(searchSql,[userid])
        if (isSign instanceof Array && isSign.length > 0) {
            ctx.body = {
                status: true,
                data: isSign
            }
        } else {
            ctx.body = {
                status: true,
                data: []
            }
        }

    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '操作失败，请重试！'
        }
    }
}

module.exports = {
    signin,
    userList,
    allList,
    monthList,
    userMonthList,
    getLevelMember,
    setLevelMember
};