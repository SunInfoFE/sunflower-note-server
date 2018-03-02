var router=require('koa-router')();
var userModel=require('../lib/mysql.js');

// post 登录
router.post('/signIn/',async (ctx,next)=>{
    ctx.body = 'signIn'
})
module.exports=router