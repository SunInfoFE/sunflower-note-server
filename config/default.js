const config = {
    // 启动端口号
    port: 3000,
    // 数据库配置
    database: {
        DATABASE: 'weeklyreport_db',
        USERNAME: 'admin',
        PASSWORD: '123456',
        PORT: 3306,
        HOST: 'localhost'
    },
    email: {
        USERNAME: 'username@suninfo.com',
        PASSWORD: 'p@ssw0rd123'
    }
}

module.exports = config