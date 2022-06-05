const db = require("../server");

function readMeja(req, res, next) {
  db.query("SELECT * FROM meja ORDER BY id ASC", (err, results) => {
    res.locals.dataMeja = results;

    err == true ? res.json({ msg: err }) : next();
  });
}

function createMeja(req, res, next) {
  const { max, status } = req.body;

  db.query(`INSERT INTO data_meja (max_orang, status_reservasi) VALUES ('${max}', '${status}')`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

function updateMeja(req, res, next) {
  const id = parseInt(req.params.id);
  const { max, status } = req.body;

  db.query(`UPDATE data_meja SET max_orang='${max}', status_reservasi='${status}' WHERE id_meja='${id}'`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

function deleteMeja(req, res, next) {
  const id = parseInt(req.params.id);

  db.query(`DELETE FROM data_meja WHERE id_meja='${id}'`, err => {
    err == true ?
      res.json({ msg: err }) : next();
  });
}

module.exports = {
  readMeja,
  createMeja,
  updateMeja,
  deleteMeja
};
