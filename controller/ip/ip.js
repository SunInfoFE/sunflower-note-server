const query = require('../../lib/mysql.js')
// 获取所有ip信息
let getAllIpData = async (ctx, next) => {
    try {
        let sql = `SELECT * FROM ip_info`
        let result = await query(sql)
        if(result instanceof Array && result.length > 0) {
            ctx.body = {
                data: result,
                status: true
            }
        } else {
            ctx.body = {
                status: false,
                data: []
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR -- ${err}`)
        ctx.body = {
            status: false,
            data: []
        }
    }
}
// 申请ip
let applyIp = async (ctx, next) => {
    try {
        let {remarks, ip} = ctx.request.body
        let sqlName = `SELECT name FROM user_info WHERE email=?`
        let name = await query(sqlName, [ctx.session.userId])
        if(name instanceof Array && name.length > 0) {
            let sql = `UPDATE ip_info SET used=1,email=?,remarks=?,name=? WHERE ip=?`
            let result = await query(sql, [ctx.session.userId, remarks, name[0].name, ip])
            if(result.affectedRows === 1) {
                ctx.body = {
                    status: true,
                    data: []
                }
            } else {
                ctx.body = {
                    status: false,
                    data: []
                }
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR -- ${err}`)
        ctx.body = {
            status: false,
            data: []
        }
    }
}
// 归还IP
let returnIp = async (ctx, next) => {
    try {
        let {ip} = ctx.request.body
        let sql = `UPDATE ip_info SET used=0,email='',remarks='',name='' WHERE ip=?`
        let result = await query(sql, [ip])
        if(result.affectedRows === 1) {
            ctx.body = {
                status: true,
                data: []
            }
        } else {
            ctx.body = {
                status: false,
                data: []
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR -- ${err}`)
        ctx.body = {
            status: false,
            data: []
        }
    }
}
// 获取我拥有的IP
let getMyIp = async (ctx, next) => {
    try {
        let sql = `SELECT * FROM ip_info WHERE email=?`
        let result = await query(sql, ctx.session.userId)
        if(result instanceof Array && result.length > 0) {
            ctx.body = {
                status: true,
                data: result
            }
        } else {
            ctx.body = {
                status: false,
                data: []
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR -- ${err}`)
        ctx.body = {
            status: false,
            data: []
        }
    }
}

module.exports = {
    getAllIpData,
    returnIp,
    getMyIp,
    applyIp
}