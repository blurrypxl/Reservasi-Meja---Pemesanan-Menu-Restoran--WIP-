const db = require('../server');
// const timestamp = require('time-stamp');

function readPesananById(req, res, next) {
  const idPelanggan = req.params.id;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT pesanan.id, menu.nama_menu, pesanan.qty, pesanan.total_harga FROM pesanan JOIN pelanggan ON pesanan.id_pelanggan = pelanggan.id JOIN menu ON pesanan.id_menu = menu.id WHERE pelanggan.id='${idPelanggan}'`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });
  
      res.locals.dataPesanan = results;
  
      db.query(`SELECT reservasi.id, pelanggan.nama_pelanggan, pelanggan.id_meja, meja.nomor_meja, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id JOIN meja ON pelanggan.id_meja = meja.id WHERE reservasi.id_pelanggan='${idPelanggan}'`, (err, results) => {
        if (err) return db.rollback(() => { throw err; });

        res.locals.dataReservasi = results;

        next();
      });
    });
  });
}

function updateStatusTransaksi(req, res, next) {

}

module.exports = {
  readPesananById,
  updateStatusTransaksi,
};
