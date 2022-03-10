const db = require("../server");

function readMenu(req, res, next) {
  req.session.loggedIn == true ?
    db.query("SELECT * FROM data_menu ORDER BY id_menu ASC", (err, results) => {
      res.locals.dataMenu = results;
      
      err == true ?
        res.json({ msg: err }) : next();
    }) : res.status(200).redirect("/login");
}

function createMenu(req, res, next) {
  const { nama, harga, jenis } = req.body; // Destructing Assignment (DA)

  db.query(`INSERT INTO data_menu (nama_menu, harga, jenis_menu) VALUES ('${nama}', '${harga}', '${jenis}')`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

function updateMenu(req, res, next) {
  const id = parseInt(req.params.id);
  const { nama, harga, jenis } = req.body;

  db.query(`UPDATE data_menu SET nama_menu='${nama}', harga='${harga}', jenis_menu='${jenis}' WHERE id_menu='${id}'`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

function deleteMenu(req, res, next) {
  const id = parseInt(req.params.id);

  db.query(`DELETE FROM data_menu WHERE id_menu='${id}'`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

module.exports = {
  readMenu,
  createMenu,
  updateMenu,
  deleteMenu
};
