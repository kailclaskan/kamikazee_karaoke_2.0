"use strict"

const mysql = require("mysql");

let db;

db = mysql.createPool({
    connectionLimit: 10000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    localAddress: "http://127.0.0.1",//"p3plcpnl0979.prod.phx3.secureserver.net",//process.env.HOST,
    socketPath: 3306,
    user: "kailclaskan",//process.env.USER,
    password: "Mhb12tr@^red95",//"mhb3f14B5",//process.env.PW,
    database: "kamikazee_karaoke_test",//process.env.DB_NAME,
    debug:false
});

module.exports = db;