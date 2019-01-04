const query = require('../../lib/mysql.js')
// 获取所有ip信息
let getAllIpData = async (ctx, next) => {
    try {
        let sql = `SELECT * FROM ip_info ORDER BY segment,id ASC`
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
// 添加一个网段机器对应所有ip
let addNetSegment = async(ctx, next) => {
    try {
        let {segment} = ctx.request.body
        //console.log(segment)
        let result = null
        let affectedRows = 0
        let insertSql = `INSERT INTO ip_info (ip,used,remarks,email,name,segment) VALUES (?,'0','','','',?)`
        let a = 509
        for(let i = 1; i < 255; i++) {
            result = await query(insertSql, [`192.168.${segment}.${i}`, segment])
            //console.log(`192.168.211.${i}`)
            if(result.affectedRows === 1) {
                affectedRows ++
            }
            a ++
        }
        if(affectedRows === 254) {
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
let setSegment = async(ctx, next) => {
    try {
        let sql = `SELECT ip from ip_info`
        let result = await query(sql)
        let sql2 = `UPDATE ip_info SET segment=? where ip=?`
        let result2 = null
        let segment = ''
        for(let i = 0; i < result.length; i ++) {
            segment = String(result[i].ip).split('.')[2]
            result2 = await query(sql2, [segment, result[i].ip])
        }
        ctx.body = {
            status: true,
            data: []
        }
    } catch(e) {

    }
}
// 删除整个网段的ip
let deleteSegment = async(ctx, next) => {
    try {
        let {segment} = ctx.request.body
        let sql = `DELETE FROM ip_info WHERE segment=?`
        let result = await query(sql, [segment])
        if (result.affectedRows > 0) {
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
// 计算某个网段中包使用的ip的数量
let count = async(ctx, next) => {
    let {segment} = ctx.request.body
    let sql = `SELECT COUNT(*) FROM ip_info WHERE segment=? AND used=1`
    let result = await query(sql, [segment])
    let num = 0
    for (const x in result[0]) {
        if (result[0].hasOwnProperty(x)) {
            num = result[0][x];  
        }
    }
    ctx.body = {
        status: true,
        data: num
    }
}
// 获取所有网段的种类
let getSegment = async(ctx, next) => {
    try {
        let sql = `SELECT DISTINCT segment FROM ip_info ORDER BY segment ASC`
        let result = await query(sql);
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
// 获取某一网段的所有ip信息
let getIpBySegment = async(ctx, next) => {
    try {
        let {segment} = ctx.request.body
        let sql = `SELECT * FROM ip_info WHERE segment=?`
        let result = await query(sql, segment)
        console.log(result)
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
    applyIp,
    addNetSegment,
    setSegment,
    deleteSegment,
    count,
    getSegment,
    getIpBySegment
}