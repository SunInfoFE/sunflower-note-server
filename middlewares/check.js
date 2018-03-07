// 存放判断登录与否文件
/* module.exports = {
  // 已经登录了
  checkNotLogin: (ctx) => {
    if (ctx.session && ctx.session.user) {
      ctx.redirect('/posts');
      return false;
    }
    return true;
  },
  //没有登录
  checkLogin: (ctx) => {
    if (!ctx.session || !ctx.session.user) {
      ctx.redirect('/signIn');
      return false;
    }
    return true;
  }
}; */

/**
 * 根据session判断用户是否已经登录
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let isLogin = async (ctx, next) => {
  if (ctx.path !== '/user/login' && ctx.path !== '/user/register') {
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