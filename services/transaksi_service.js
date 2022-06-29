const db = require('../server');
// const timestamp = require('time-stamp');

function readPesananById(req, res, next) {
  const idPelanggan = req.params.id;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT pesanan.id, menu.nama_menu, pesanan.qty, pesanan.total_harga FROM pesanan JOIN pelanggan ON pesanan.id_pelanggan = pelanggan.id JOIN menu ON pesanan.id_menu = menu.id WHERE pelanggan.id='${idPelanggan}'`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });
      
      let total = 0;

      results.forEach(item => {
        total += parseInt(item.total_harga);
      });

      res.locals.dataPesanan = results;
      res.locals.total = total;
  
      db.query(`SELECT reservasi.id, reservasi.id_pelanggan, pelanggan.nama_pelanggan, pelanggan.id_meja, meja.nomor_meja, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id JOIN meja ON pelanggan.id_meja = meja.id WHERE reservasi.id_pelanggan='${idPelanggan}'`, (err, results) => {
        if (err) return db.rollback(() => { throw err; });

        res.locals.dataReservasi = results;

        next();
      });
    });
  });
}

function readTotalTransaksi(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM transaksi`, (err, results) => {
    if (err) throw err;

    res.locals.totalTransaksi = results;

    next();
  });
}

function updateStatusTransaksi(req, res, next) {}

module.exports = {
  readPesananById,
  readTotalTransaksi,
  updateStatusTransaksi,
};
