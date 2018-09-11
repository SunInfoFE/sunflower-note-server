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
            let card_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            let isSign = await query(searchSql, [userid,card_time])
            if (isSign instanceof Array && isSign.length > 0) {
                ctx.body = {
                    status: false,
                    data: '已签！'
                }
            } else {
                let sql = `INSERT INTO punch_card (userid,card_time,card_status) VALUES (?,?,?);`
                let card_status = 1;
                let insertGroup = await query(sql, [userid, card_time,card_status])
                console.log(insertGroup)
                if (insertGroup.affectedRows === 1) {
                    ctx.body = {
                        status: true,
                        data: '新增成功'
                    }
                } else {
                    ctx.body = {
                        status: false,
                        data: '新增失败，请重试！'
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
            data: '新增失败，请重试！'
        }
    }
}
//请假
let leave = async (ctx, next) => {
    /**
     * card_status 2 : 请假
     */
    let {userid} = ctx.request.body

    let searchSql = `SELECT * FROM punch_card WHERE userid=? and card_time=?`
    try {
        if (userid !== (undefined || '')) {
            let date = new Date();
            let card_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            let isSign = await query(searchSql, [userid,card_time])
            if (isSign instanceof Array && isSign.length > 0) {
                ctx.body = {
                    status: false,
                    data: '已签！'
                }
            } else {
                let sql = `INSERT INTO punch_card (userid,card_time,card_status) VALUES (?,?,?);`

                let card_status = 2;
                let insertGroup = await query(sql, [userid, card_time,card_status])
                console.log(insertGroup)
                if (insertGroup.affectedRows === 1) {
                    ctx.body = {
                        status: true,
                        data: '新增成功'
                    }
                } else {
                    ctx.body = {
                        status: false,
                        data: '新增失败，请重试！'
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
            data: '新增失败，请重试！'
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
                    status: false,
                    data: '没有数据'
                }
            }
        } else {
            ctx.status = 500
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '新增失败，请重试！'
        }
    }
}

let allList = async (ctx, next) => {
    let searchSql = `SELECT userid,card_time,card_status FROM punch_card`
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
                    status: false,
                    data: '没有数据'
                }
            }
        } else {
            ctx.status = 500
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '新增失败，请重试！'
        }
    }
}

module.exports = {
    signin,
    leave,
    userList,
    allList
};