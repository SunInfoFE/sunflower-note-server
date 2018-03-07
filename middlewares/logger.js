/**
 * Created by caoLiXin on 2018/3/6.
 */
let logger = async (ctx, next) => {
  let reqData = {
    origin: ctx.origin,
    date: new Date(parseInt(ctx.query.t)).toLocaleString(),
    api: {
      method: ctx.method,
      url: ctx.url,
      path: ctx.path,
      query: ctx.query
    }
  };
  console.log(`==========REQUEST==LOGGER==START==========`);
  console.log(reqData);
  console.log(`===========REQUEST==LOGGER==END===========`);

  await next()
};

module.exports = logger;