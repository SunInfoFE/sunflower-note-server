var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
});

// query: 通过返回promise的方式以便可以方便用.then()来获取数据库返回的数据
let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                resolve( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}

// 创建表的函数
let createTable = function( sql ) {
    return query( sql, [] )
}

// 定义表

// 例如：
// 如果users表不存在则创建该表，避免每次重复建表报错的情况
// users=
//     `create table if not exists users(
//  id INT NOT NULL AUTO_INCREMENT,
//  name VARCHAR(100) NOT NULL,
//  pass VARCHAR(40) NOT NULL,
//  PRIMARY KEY ( id )
// );`
// 建表
// createTable(users)
// 注册用户
// let insertData = function( value ) {
//     let _sql = "insert into users(name,pass) values(?,?);"
//     return query( _sql, value )
// }




module.exports={
    query,
    createTable
    // insertData,
}