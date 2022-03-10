const db = require("../server");

function readReservasi(req, res) {
  db.query("SELECT * FROM data_reservasi ORDER BY id_reservasi ASC", (err, results) => {
    if (err) {
      res.json({ msg: err });
    } else if (!err) {
      res.status(200).render("pages/dataReservasi", { reservasi: results });
    }
  });
}

module.exports = {
  readReservasi,
};
