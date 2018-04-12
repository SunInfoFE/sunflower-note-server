/**
 * Created by caoLiXin on 2018/3/23.
 */
const nodemailer = require('nodemailer');

// 发送邮件
let sendMail = (data) => {
  // 实例化 nodemailer transport 对象
  let transporter = nodemailer.createTransport({
    host: '172.18.0.17',            // 邮件服务器地址
    port: 25,                       // 邮件服务器端口
    rescue: false,                  // 是否是465端口
    auth: {
      user: data.from,              // 邮箱地址
      pass: data.licenseKey         // 邮箱提供给第三方接口的授权码（也可以是邮箱密码）
    }
  });

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