const mysql = require('mysql');
const config = require('../config/default.js');

const pool  = mysql.createPool({
  host : config.database.HOST,
  port : config.database.PORT,
  user : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

// query: 通过返回promise的方式以便可以方便用.then()或者async-await来获取数据库返回的数据
let query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
};

module.exports = query;