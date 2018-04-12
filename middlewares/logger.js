/**
 * Created by caoLiXin on 2018/3/6.
 */
let logger = async (ctx, next) => {
  let start = new Date();
  let reqData = {
    origin: ctx.request.header.origin,
    date: new Date().toLocaleString(),
    api: {
      method: ctx.method,
      url: ctx.url,
      path: ctx.path,
      query: ctx.query,
      body: ctx.request.body
    }
  };
  await next();
  let ms = new Date() - start;
  console.log(`[==API Request Logger==] -- origin:${reqData.origin},dateTime:${reqData.date},API:(${reqData.api.method})${reqData.api.path},query:${JSON.stringify(reqData.api.query)},body:${JSON.stringify(reqData.api.body)},time:${ms}ms`);
};

module.exports = logger;