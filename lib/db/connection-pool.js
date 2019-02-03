const mysql = require('mysql');
const poolConfig = require('./config/mysql').poolConfig;
let pool = mysql.createPool(poolConfig);

module.exports = pool;
