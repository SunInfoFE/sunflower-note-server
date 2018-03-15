/**
 * Created by caoLiXin on 2018/3/12.
 */
const fs = require('fs');

// 读取配置文件
let readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${process.cwd()}/config/sysConfig.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// 重写配置文件
let writeConfig = (writeData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${process.cwd()}/config/sysConfig.json`, writeData, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('success');
      }
    })
  });
}

/**
 * 系统设置
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let set = async (ctx, next) => {
  try {
    let read = await readConfig();

    if (read) {
      let settingData = JSON.parse(read);
      let settingDataKeys = Object.keys(settingData);
      let reqKeys = Object.keys(ctx.request.body);

      reqKeys.forEach((item, index) => {
        if (settingDataKeys.indexOf(item) !== -1) {
          settingData[item] = ctx.request.body[item]
        }
      })
      settingData = JSON.stringify(settingData);

      let write = await writeConfig(settingData);

      if (write === 'success') {
        ctx.body = {
          status: true,
          data: '保存成功！'
        }
      } else {
        ctx.body = {
          status: true,
          data: write
        }
      }
    } else {
      ctx.body = {
        status: true,
        data: read
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: err.message
    }
  }
};

/**
 *获取系统配置
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
let get = async (ctx, next) => {
  try {
    let read = await readConfig();
    if (read) {
      ctx.body = {
        status: true,
        data: JSON.parse(read)
      }
    } else {
      ctx.body = {
        status: false,
        data: read
      }
    }
  } catch(err) {
    console.log(`${ctx.method} - ${ctx.url} ERROR -- ${err}`);
    ctx.body = {
      status: false,
      data: err.message
    }
  }
};

module.exports = {
  set,
  get
}