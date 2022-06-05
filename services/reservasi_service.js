const db = require("../server");

function readReservasi(req, res, next) {
  db.query("SELECT reservasi.id_pelanggan, pelanggan.id_meja, reservasi.email, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id", (err, results) => {
    if (err) {
      res.json({ msg: err });
    } else if (!err) {
      res.locals.allReservasi = results;
      next();
    }
  });
}

module.exports = {
  readReservasi,
};
