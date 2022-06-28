const db = require("../server");
const timestamp = require("time-stamp");

function readMenu(req, res, next) {
  db.query("SELECT * FROM menu ORDER BY id ASC", (err, results) => {
    if (err) throw err;

    res.locals.dataMenu = results;

    next();
  });
}

function readTotalMenu(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM menu`, (err, results) => {
    if (err) throw err;

    res.locals.totalMenu = results;

    next();
  });
}

function createMenu(req, res, next) {
  const { id_user, nama_menu, jenis_menu, harga, gambar_menu, status } = req.body; // Destructing Assignment (DA)
  const createAt = timestamp('DD:mm:YYYY-MM-DD');

  db.query(`INSERT INTO menu (id_user, nama_menu, jenis_menu, harga, gambar_menu, status, create_at, update_at) VALUES ('${id_user}', '${nama_menu}', '${jenis_menu}', '${harga}', '${gambar_menu}', '${status}', '${createAt}', '${createAt}')`, err => {
    if (err) throw err;

    next();
  });
}

function updateMenu(req, res, next) {
  const id = parseInt(req.params.id);
  const { id_user, nama_menu, jenis_menu, harga, gambar_menu, status } = req.body;
  const updateAt = timestamp('DD:mm:YYYY-MM-DD');

  db.query(`UPDATE menu SET id_user='${id_user}', nama_menu='${nama_menu}, jenis_menu='${jenis_menu}, harga='${harga}, gambar_menu='${gambar_menu}, status='${status}', update_at='${updateAt}' WHERE id_menu='${id}'`, err => {
    if (err) throw err;

    next();
  });
}

function deleteMenu(req, res, next) {
  const id = parseInt(req.params.id);

  db.query(`DELETE FROM menu WHERE id_menu='${id}'`, err => {
    if (err) throw err;

    next();
  });
}

module.exports = {
  readMenu,
  readTotalMenu,
  createMenu,
  updateMenu,
  deleteMenu
};
