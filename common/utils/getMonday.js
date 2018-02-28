/**
 * Created by caoLiXin on 2018/2/25.
 */

/**
 * 获取当前日期所在周的周一日期
 * @returns {string}
 */
export default function getMonday() {
  let now = new Date();
  let nowDay = now.getDay() === 0 ? 7 : now.getDay();   // 获取当前星期数
  let gapDay = nowDay -1;                               // 计算当前星期与周一的天数差
  let millSeconds = gapDay * 24 * 3600 * 1000           // 计算当前星期与周一相差毫秒数
  return new Date(now.getTime() - millSeconds).toLocaleDateString()   // 计算周一日期
}