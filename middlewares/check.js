/**
 * 根据session判断用户是否已经登录
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let isLogin = async (ctx, next) => {
  const notCheckPath = ['/user/login', '/user/adminLogin', '/user/register', '/group/groupManage/get', '/system/getSysSetting'];   // 无需检查的接口

  if (notCheckPath.indexOf(ctx.path) === -1) {
    if (!ctx.session.userId) {
      ctx.body = {
        status: false,
        data: 'Not Login'
      }
    } else {
      await next()
    }
  } else {
    await next()
    // if (ctx.path === '/user/login') {
    //   if (ctx.session.userId) {
    //     ctx.body = {
    //       status: false,
    //       data: 'Already Login'
    //     }
    //   } else {
    //     await next()
    //   }
    // } else {
    //   await next()
    // }
  }
};

module.exports = isLogin;