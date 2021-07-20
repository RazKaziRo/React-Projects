const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const mysql = require('mysql');
const { mysqlConfig } = require('./config')
const mysqldb = mysql.createConnection(mysqlConfig);

module.exports = { admin, db, mysqldb};
