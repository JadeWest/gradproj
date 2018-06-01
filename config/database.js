const mysql = require('mysql');

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lockick*88',
    database: 'graddb'
});

module.exports = DB;