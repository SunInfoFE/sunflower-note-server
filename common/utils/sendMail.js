/**
 * Created by caoLiXin on 2018/3/23.
 */
const nodemailer = require('nodemailer');

// 发送邮件
let sendMail = (data) => {
  // 不同邮件的邮箱服务器设置
  let mailerOptions = {
    host: '',            // 邮件服务器地址
    port: '',            // 邮件服务器端口
    rescue: '',          // 是否是465端口
  }

  // 区别邮箱，设置邮件服务器配置
  if (data.from.indexOf('@suninfo.com') !== -1) {
    // suninfo 公司邮箱
    mailerOptions.host = '172.18.0.17';
    mailerOptions.port = 25;
    mailerOptions.rescue = false;
  } else if (data.from.indexOf('@qq.com') !== -1) {
    // QQ邮箱
    mailerOptions.host = 'smtp.qq.com';
    mailerOptions.port = 465;
    mailerOptions.rescue = true;
  }

  // 实例化 nodemailer transport 对象
  let option = Object.assign({}, {
    host: '172.18.0.17',            // 邮件服务器地址
    port: 25,                       // 邮件服务器端口
    rescue: false,                  // 是否是465端口
    auth: {
      user: data.from,              // 邮箱地址
      pass: data.licenseKey         // 邮箱提供给第三方接口的授权码（也可以是邮箱密码）
    }
  }, mailerOptions)
  console.log(option)
  let transporter = nodemailer.createTransport(option);

  // 设置邮件传输内容
  let mailOptions = {
    from: data.from,                // 发件人地址
    to: data.to,                    // 收件人地址，多个以','分隔
    cc: data.cc,                    // 抄送人地址，多个以','分隔
    subject: data.title,            // 邮件标题
    text: data.content || '',       // 邮件内容
    html: data.content              // 邮件内容（text和html属性值都有的时候，文件正文显示html属性值）
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    });
  })
};

module.exports = sendMail