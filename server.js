const mysql = require("mysql");

const conn = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "root",
  password: "",
  database: "moji_db"
});

module.exports = conn;
