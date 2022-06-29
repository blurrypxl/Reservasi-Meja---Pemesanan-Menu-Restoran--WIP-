const db = require("../server");
// const { v4: uuidv4 } = require('uuid');
const gUniqId = require('generate-unique-id');
const timestamp = require("time-stamp");

function readReservasi(req, res, next) {
  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}'`, (err, results) => {
    if (err) res.json({ msg: err });
    
    const tglHariIni = new Date(timestamp("YYYY-MM-DD")).setHours(0,0,0,0);

    // console.log(tglHariIni);

    // value pada variabel filterReservasi berisi object reservasi yang memiliki tanggal reservasi yang sama dengan hari ini dan lebih dari tanggal hari ini.
    const filterReservasi = [];

    for(let i = 0; i < results.length; i++) {
      // console.log(new Date(results[i].untuk_tanggal).setHours(0,0,0,0));

      if (new Date(results[i].untuk_tanggal).setHours(0,0,0,0) >= tglHariIni) {   
        filterReservasi.push({
          id_meja: results[i].id_meja,
          untuk_tanggal: results[i].untuk_tanggal
        });
      }
    }

    // console.log(filterReservasi);
    // console.log(results);

    res.locals.allReservasi = filterReservasi;

    next();
  });
}

function readTotalReservasi(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM reservasi`, (err, results) => {
    if (err) throw err;

    res.locals.totalReservasi = results;

    next();
  });
}

function validasiTanggalReservasi(req, res, next) {
  const { nama, email, id_meja, nomor_meja, untuk_tgl } = req.body;
  const idPelanggan = "PLG-"+gUniqId({ length: 7 });

  // console.log(id_meja);

  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE pelanggan.id_meja = '${id_meja}' AND (reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}')`, (err, results) => {
    if (err) throw err; // Tampilkan Error

    // console.log(results);

    const tglHariIni = new Date(timestamp("YYYY-MM-DD")).setHours(0,0,0,0);

    // menyaring reservasi terbaru & reservasi dengan tanggal yang sama
    const filterReservasi = [];

    for(let i = 0; i < results.length; i++) {
      if (new Date(results[i].untuk_tanggal).setHours(0,0,0,0) >= tglHariIni) {
        if (results[i].untuk_tanggal === untuk_tgl) {
          filterReservasi.push(results[i].untuk_tanggal);
        }
      }
    }

    // console.log('panjang isi filter reservasi = '+filterReservasi.length);
    // console.log(filterReservasi);

    if (filterReservasi.length === 0) {
      res.locals.validasiReservasi = [idPelanggan, nama, email, id_meja, nomor_meja, untuk_tgl];

      next();
    }
    else if (filterReservasi.length > 0) {
      res.locals.errMsgValidasi = 'Meja ini sudah direservasi oleh pelanggan lain. Silahkan pilih Nomor Meja yang berbeda atau pilih lain hari.';

      next();
    }
  });
}

function updateStatusReservasi(req, res, next) {}

function updateDateReservasi(req, res, next) {}

module.exports = {
  readReservasi,
  readTotalReservasi,
  validasiTanggalReservasi,
};
