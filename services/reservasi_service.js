const db = require("../server");
const timestamp = require("time-stamp");

function readReservasi(req, res, next) {
  db.query(`SELECT reservasi.id_pelanggan, pelanggan.id_meja, reservasi.email, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}'`, (err, results) => {
    if (err) res.json({ msg: err });
    
    const tglHariIni = new Date(timestamp("DD/MM/YYYY"));

    const filterReservasi = results.filter(item => new Date(item.untuk_tanggal) >= tglHariIni);

    // console.log(filterReservasi);

    res.locals.allReservasi = filterReservasi;

    next();
  });
}

function validasiTanggalReservasi(req, res, next) {
  const { nama, email, id_meja, untuk_tgl } = req.body;

  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE pelanggan.id_meja = '${id_meja}' AND reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}'`, (err, results) => {
    if (err) throw err; // Tampilkan Error

    const tglHariIni = new Date(timestamp("DD/MM/YYYY"));

    const filterReservasi = results.filter(item => new Date(item.untuk_tanggal) >= tglHariIni).filter(item => item.untuk_tanggal === untuk_tgl); // Menggunakan Array.filter() untuk menyaring reservasi terbaru & reservasi dengan tanggal yang sama

    // console.log(filterReservasi);

    if (filterReservasi.length >! 0) {
      res.locals.errMsgValidasi = 'Meja ini sudah direservasi oleh pelanggan lain. Silahkan pilih Nomor Meja yang berbeda atau pilih lain hari.';

      next();
    }
    
    res.locals.validasiReservasi = [nama, email, id_meja, untuk_tgl];

    next();
  });
}

module.exports = {
  readReservasi,
  validasiTanggalReservasi,
};
