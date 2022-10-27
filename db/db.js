const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    port: 3004,

    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

module.exports = db;