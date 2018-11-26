const query = require('../../lib/mysql.js')
const CommitTime = "09:00:00"
//封装获取时间函数
function getTime() {
    let date = new Date();
    let hourStr = String(date.getHours());
    let hour = hourStr.length === 1 ? '0' + hourStr : hourStr;
    let minuteStr = String(date.getMinutes());
    let minute = minuteStr.length === 1 ? '0' + minuteStr : minuteStr;
    let secondStr = String(date.getSeconds());
    let second = secondStr.length === 1 ? '0' + secondStr : secondStr;
    return hour + ':' + minute + ':' + second;
}
//封装获取日期函数
function getDate() {
    let date = new Date();
    let monthStr = String(date.getMonth() + 1);
    let month = monthStr.length === 1 ? '0' + monthStr : monthStr;
    let dayStr = String(date.getDate());
    let day = dayStr.length === 1 ? '0' + dayStr : dayStr;
    return date.getFullYear() + "-" + month + "-" + day;
}
//初始化
let init = async (ctx, next) => {
    try {
        let date = getDate()
        let time = getTime()
        let flag = true
        let sql = `UPDATE today_dinner SET selected=0,mount=0;`
        let dateSql = `SELECT date FROM today_dinner`
        let userSql = `UPDATE user_info SET dinner=''`
        let dateResult = await query(dateSql);
        //将today_dinner表中的date与当前日期进行比较，如果有相同，表示今天已经发布了晚餐
        for(let i = 0;i < dateResult.length; i++) {
            if(dateResult[i].date == date) {
                flag = false;
                break;
            }
        }
        //如果今天还没发布晚餐，执行初始化，将数据清空
        if(flag == true) {
            let result = await query(sql);
            let userResult = await query(userSql)
            if(result.affectedRows > 0 && userResult.affectedRows > 0) {
                ctx.body = {
                    status: true,
                    data: time
                }
            } else {
                ctx.body = {
                    status: false,
                    data: time
                }
            }
            //如果已经发布，则不需要清空数据
        } else {
            ctx.body = {
                status: 2,
                data: time
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '失败'
        }
    }
}

//获取菜单
let getMenu = async (ctx, next) => {
    try {
        let sql = `SELECT dinner FROM dinner_info;`
        let menu = await query(sql);
        if(menu instanceof Array && menu.length > 0) {
            ctx.body = {
                status: true,
                data: menu
            }
        } else {
            ctx.body = {
                status: false,
                data: '查询失败，请重试'
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '查询失败，请重试'
        }
    }
}
//发布晚餐
let setDinner = async (ctx, next) => {
    try {
        let date = getDate()
        console.log(date)
        let { dinner } = ctx.request.body;
        console.log(dinner)
        let s = ''
        for(let i = 0; i < dinner.length; i++) {
            if(i < dinner.length-1){
                s += 'dinner=' + '"' + dinner[i].foodName + '"' + ' OR ';
            } else {
                s += 'dinner=' + '"' + dinner[i].foodName + '"'
            }
        }
        let setSql = `UPDATE today_dinner SET selected=1,date=? WHERE ${s};`
        let sql = `SELECT * FROM today_dinner WHERE selected=1`
        let isSet = await query(sql);
        let Result = await query(setSql, [date])
        if(isSet instanceof Array && isSet.length == 0) {
            if(Result.affectedRows == dinner.length){
                ctx.body = {
                    status: true,
                    data: 'ok'
                }
            } else {
                ctx.body = {
                    status: false,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                status: 2,
                data:'已经设置过晚餐'
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: "发布失败"
        }
    }
}
//获取今天的加班餐种类
let getTodayDinner = async (ctx, next) => {
    try {
        let sql = `SELECT dinner FROM today_dinner WHERE selected=1;`
        let dinner = await query(sql);
        if(dinner instanceof Array && dinner.length > 0 ) {
            ctx.body = {
                status: true,
                data: dinner
            }
        } else {
            ctx.body = {
                status: false,
                data: '今天还没发布加班餐...'
            }                              
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '系统出错，请稍后再试'
        }
    }
}
//提交
let commitDinner = async (ctx, next) => {
    try {
        let { dinner } = ctx.request.body;
        let time = getTime();
        let sql = `UPDATE today_dinner SET mount=mount+1 WHERE dinner=?;`
        let userSql = `UPDATE user_info SET dinner=? WHERE email=?`
        //判断时间是否小于下午4点
        if(time < CommitTime) {
            let result = await query(sql, [dinner]);
            let userResult = await query(userSql, [dinner, ctx.session.userId])
            if(result.affectedRows === 1 && userResult.affectedRows === 1) {
                ctx.body = {
                    status: true,
                    data: '提交成功'
                }
            } else {
                ctx.body = {
                    status: false,
                    data: '提交失败'
                }
            }
        } else {
            ctx.body = {
                status: false,
                data: `超过${ CommitTime }就不能再点餐了(┬＿┬)`
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '提交失败,请重试'
        }
    }
}
//获取总数
let getDinnerMount = async (ctx, next) => {
    try {
        let sql = `SELECT dinner,mount FROM today_dinner WHERE selected=1;`
        let dinnerMount = await query(sql);
        if(dinnerMount instanceof Array && dinnerMount.length > 0) {
            ctx.body = {
                status: true,
                data: dinnerMount
            }
        } else {
            ctx.body = {
                status: false,
                data: '还没有人点餐...'
            }
        }
    } catch (err) {
        ctx.body = {
            status: false,
            data: '查询失败,请重试'
        }
    }
}
//获取用户晚餐
let getUserDinner = async (ctx, next) => {
    try {
        let sql = `SELECT dinner FROM user_info WHERE email=?`
        let result = await query(sql, [ctx.session.userId])
        if(result instanceof Array && result.length > 0) {
            ctx.body = {
                status: true,
                data: result
            }
        } else {
            ctx.body = {
                status: true,
                data: result
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '服务器错误'
        }
    }
}
//修改晚餐（未用）
let modifyDinner = async (ctx, next) => {
    try {
        let { oldDinner, newDinner } = ctx.request.body;
        let reduceSql = `UPDATE today_dinner SET mount=mount-1 WHERE dinner=?;`
        let addSql = `UPDATE today_dinner SET mount=mount+1 WHERE dinner=?;`

        let reduceResult = await query(reduceSql, [oldDinner]);
        let addResult = await query(addSql, [newDinner]);

        if(reduceResult.affectedRows === 1 && addResult.affectedRows === 1) {
            ctx.body = {
                status: true,
                data: '修改成功'
            }
        } else {
            ctx.body = {
                status: false,
                data: '修改失败'
            }
        }
    } catch (err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: "修改提交失败"
        }
    }
}
//清除用户所选的晚餐
 let deleteDinner = async (ctx, next) => {
    try {
        let time = getTime()
        let sql = `SELECT dinner FROM user_info WHERE email=?`
        let deleteSql = `UPDATE today_dinner SET mount=mount-1 WHERE dinner=?`
        let deleteUserSql = `UPDATE user_info SET dinner=null WHERE email=?`
        if(time < CommitTime) {
            let sqlResult = await query(sql, [ctx.session.userId])
            let result = await query(deleteSql, [sqlResult[0].dinner]);
            let userResult = await query(deleteUserSql, [ctx.session.userId])
            if(sqlResult instanceof Array && sqlResult.length > 0 ) {
                if(result.affectedRows === 1 && userResult.affectedRows === 1) {
                    ctx.body = {
                        status: true,
                        data: '取消成功,现在可以重新选择'
                    }
                } else {
                    ctx.body = {
                        status: false,
                        data: '你还没提交过晚餐...'
                    }
                }
            } else {
                ctx.body = {
                    status: false,
                    data: '取消失败，请重试'
                }
            }
        } else {
            ctx.body = {
                status: false,
                data: `超过${ CommitTime }就不能取消了(┬＿┬)`
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
        ctx.body = {
            status: false,
            data: '取消失败，请重试'
        }
    }
} 
//管理员删除用户晚餐信息
let adminDelete = async (ctx, next) => {
    try {
        let {dinner, userId} = ctx.request.body;
        let deleteUserSql  = `UPDATE user_info SET dinner='' WHERE email=?;`
        let deleteSql = `UPDATE today_dinner SET mount=mount-1 WHERE dinner=?;`
        let userResult = await query(deleteUserSql, [userId])
        let result = await query(deleteSql, [dinner])
        if(userResult.affectedRows == 1 && result.affectedRows == 1) {
            ctx.body = {
                status: true,
                data: '删除成功'
            }
        } else {
            ctx.body = {
                status: false,
                data: '删除失败，请重试'
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR ${err}`)
    }
}
//获取所有用户晚餐
let getAllUserDinner = async(ctx, next) => {
    try {
        let sql = `SELECT email,name, dinner FROM user_info WHERE role<>'admin' AND dinner<>'' AND dinner IS NOT NULL;`
        let result = await query(sql);
        if(result instanceof Array && result.length > 0) {
            ctx.body = {
                status: true,
                data: result
            }
        } else {
            ctx.body = {
                status: false,
                data: '还没有人点餐....'
            }
        }
    } catch(err) {
        console.log(`${ctx.method} - ${ctx.url} -- ERROR ${err}`);
        ctx.body = {
            status: false,
            data: '查询失败'
        }
    }
}
module.exports = {
    init,
    getMenu,
    getTodayDinner,
    commitDinner,
    getDinnerMount,
    modifyDinner,
    setDinner,
    deleteDinner,
    getUserDinner,
    getAllUserDinner,
    adminDelete
}