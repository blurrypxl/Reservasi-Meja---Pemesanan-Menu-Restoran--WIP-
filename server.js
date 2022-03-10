const mysql = require("mysql");

const conn = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "root",
  password: "",
  database: "db_moji"
});

module.exports = conn;
