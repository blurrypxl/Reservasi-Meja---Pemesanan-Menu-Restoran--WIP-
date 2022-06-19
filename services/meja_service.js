const db = require("../server");
const timestamp = require("time-stamp");

function readMeja(req, res, next) {
  db.query("SELECT * FROM meja ORDER BY id ASC", (err, results) => {
    if (err) throw err;

    res.locals.dataMeja = results;
    
    next();
  });
}

function createMeja(req, res, next) {
  const { id_user, nomor_meja, max_person, gambar_meja } = req.body;
  const createAt = timestamp('HH:mm:YYYY-MM-DD');

  db.query(`INSERT INTO meja (id_user, nomor_meja, max_person, gambar_meja, create_at, update_at) VALUES ('${id_user}', '${nomor_meja}', '${max_person}', '${gambar_meja}', '${createAt}', '${createAt}')`, err => {
    if (err) throw err;

    next();
  });
}

function updateMeja(req, res, next) {
  const id = parseInt(req.params.id);
  const { id_user, nomor_meja, max_person, gambar_meja, create_at } = req.body;
  const updateAt = timestamp('DD:mm:YYYY-MM-DD');

  db.query(`UPDATE meja SET id_user='${id_user}', nomor_meja='${nomor_meja}', max_person='${max_person}', gambar_meja='${gambar_meja}', create_at='${create_at}', update_at='${updateAt}' WHERE id_meja='${id}'`, err => {
    if (err) throw err;

    next();
  });
}

function deleteMeja(req, res, next) {
  const id = parseInt(req.params.id);

  db.query(`DELETE FROM meja WHERE id_meja='${id}'`, err => {
    if (err) throw err;

    next();
  });
}

module.exports = {
  readMeja,
  createMeja,
  updateMeja,
  deleteMeja
};
