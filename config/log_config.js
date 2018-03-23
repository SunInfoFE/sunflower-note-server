/**
 * Created by huog on 2018/3/2
 */
var path = require('path');
var fs = require('fs');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

let log_config_obj = {
  appenders: {
    out: {
      type: 'console'
    },
    errorLogger: {
      "type": "dateFile",                   //日志类型
      "filename": errorLogPath,             //日志输出位置
      "alwaysIncludePattern": true,          //是否总是有后缀名
      "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
      "path": errorPath                     //自定义属性，错误日志的根目录
    },
    resLogger: {
      "type": "dateFile",
      "filename": responseLogPath,
      "alwaysIncludePattern": true,
      "pattern": "-yyyy-MM-dd-hh.log",
      "path": responsePath
    }
  },
  categories: {
    default: {appenders: ['out'], level: 'info'},  // 必须添加default，并且配置项都要写。所以添加了out
    errorLog: { appenders: ['errorLogger'], level: 'error' },
    resLog: { appenders: ['resLogger'], level: 'info' }
  },
  baseLogPath: baseLogPath                  //logs根目录
}
/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {

  if(!fs.existsSync(pathStr)){
    fs.mkdirSync(pathStr);
    console.log('createPath: ' + pathStr);
  }
}

/**
 * 初始化log相关目录
 */
var initLogPath = function(){
  //创建log的根目录'logs'
  if(baseLogPath){
    confirmPath(baseLogPath)
    //根据不同的logType创建不同的文件目录
    //log4js2.0的appenders是个对象，length无法判断直接长度
    let appendersArr = Object.keys(log_config_obj.appenders);
    for(var i = 0, len = appendersArr.length; i < len; i++){
      if(log_config_obj.appenders[appendersArr[i]].path){
        confirmPath(baseLogPath + log_config_obj.appenders[appendersArr[i]].path);
      }
    }
  }
}

initLogPath();

module.exports = log_config_obj