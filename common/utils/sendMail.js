/**
 * Created by caoLiXin on 2018/3/23.
 */
const nodemailer = require('nodemailer');

// 发送邮件
let sendMail = (data) => {

  let option = {
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: data.from, // generated ethereal user
        pass: data.licenseKey // generated ethereal password
    }
  };

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