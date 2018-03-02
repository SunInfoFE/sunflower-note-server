var router=require('koa-router')();
var userModel=require('../lib/mysql.js');
var md5=require('md5')  // 加密

// POST 注册
router.get('/signUp/',async (ctx,next)=>{
    ctx.body = 'signUp'
})

module.exports=router;