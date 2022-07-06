const db = require("../server");
const gUniqId = require('generate-unique-id');
const timestamp = require("time-stamp");

function readReservasi(req, res, next) {
  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}'`, (err, results) => {
    if (err) res.json({ msg: err });

    const tglHariIni = new Date(timestamp("YYYY-MM-DD")).setHours(0, 0, 0, 0);

    // console.log(tglHariIni);

    // value pada variabel filterReservasi berisi object reservasi yang memiliki tanggal reservasi yang sama dengan hari ini dan lebih dari tanggal hari ini.
    const filterReservasi = [];

    for (let i = 0; i < results.length; i++) {
      // console.log(new Date(results[i].untuk_tanggal).setHours(0,0,0,0));

      if (new Date(results[i].untuk_tanggal).setHours(0, 0, 0, 0) >= tglHariIni) {
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

function readReservasiById(req, res, next) {
  const idReservasi = req.params.id;

  db.query(`SELECT reservasi.id AS id_reservasi, reservasi.id_pelanggan, pelanggan.nama_pelanggan, meja.id AS id_meja, meja.nomor_meja, reservasi.email, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan=pelanggan.id JOIN meja ON pelanggan.id_meja=meja.id WHERE reservasi.id='${idReservasi}' AND (reservasi.status_reservasi='Menunggu Pembayaran' OR reservasi.status_reservasi='Menunggu Kedatangan Tamu')`, (err, dataReservasi) => {
    if (err) throw err;

    res.locals.dataReservasi = dataReservasi;
    res.locals.idPelanggan = dataReservasi.map(idP => idP.id_pelanggan); //get id pelanggan

    // console.log(res.locals.idPelanggan);

    next();
  });
}

function validasiTanggalReservasi(req, res, next) {
  const { nama, email, id_meja, nomor_meja, untuk_tgl } = req.body;
  const idPelanggan = "PLG-" + gUniqId({ length: 7 });

  // console.log(id_meja);

  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE pelanggan.id_meja = '${id_meja}' AND (reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}')`, (err, results) => {
    if (err) throw err; // Tampilkan Error

    // console.log(results);

    const tglHariIni = new Date(timestamp("YYYY-MM-DD")).setHours(0, 0, 0, 0);

    // menyaring reservasi terbaru & reservasi dengan tanggal yang sama
    const filterReservasi = [];

    for (let i = 0; i < results.length; i++) {
      if (new Date(results[i].untuk_tanggal).setHours(0, 0, 0, 0) >= tglHariIni) {
        if (results[i].untuk_tanggal === untuk_tgl) {
          filterReservasi.push(results[i].untuk_tanggal);
        }
      }
    }

    // console.log('panjang isi filter reservasi = '+filterReservasi.length);
    // console.log(filterReservasi);

    if (filterReservasi.length === 0) {
      req.session.validasiReservasi = [idPelanggan, nama, email, id_meja, nomor_meja, untuk_tgl];

      return next();
    }
    else if (filterReservasi.length > 0) {
      res.locals.errMsgValidasi = 'Meja ini sudah direservasi oleh pelanggan lain. Silahkan pilih Nomor Meja yang berbeda atau pilih lain hari.';

      return next();
    }
  });
}

function updateStatusReservasi(req, res, next) { }

function checkStatusReservasi(req, res, next) {
  const idReservasi = req.body.id_reservasi;

  db.query(`SELECT * FROM reservasi WHERE id='${idReservasi}' AND (status_reservasi='Menunggu Pembayaran' OR status_reservasi='Menunggu Kedatangan Tamu')`, (err, dataReservasi) => {
    if (err) throw err;

    // console.log(dataReservasi);

    if (dataReservasi.length === 0) {
      req.session.messages = {
        type: 'danger',
        intro: 'Data Reservasi Tidak ditemukan!',
        message: 'Reservasi yang anda masukan TIDAK TERSEDIA atau TIDAK VALID.'
      }

      return next();
    }
    else if (dataReservasi.length > 0) {
      res.locals.idReservasi = idReservasi;

      return next();
    }
  });
}

function updateDateReservasi(req, res, next) {
  const { id_reservasi, id_meja, untuk_tgl } = req.body;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT reservasi.id AS id_reservasi, reservasi.id_pelanggan, pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan=pelanggan.id WHERE pelanggan.id_meja='${id_meja}'`, (err, dataReservasi) => {
      if (err) return db.rollback(() => { throw err; });

      res.locals.idReservasi = id_reservasi;

      for (let i = 0; i < dataReservasi.length; i++) {
        if (id_reservasi === dataReservasi[i].id_reservasi) {
          // Memvalidasi tanggal reservasi
          for (let x = 0; x < dataReservasi.length; x++) {
            if (untuk_tgl === dataReservasi[x].untuk_tanggal) {
              req.session.messages = {
                type: 'warning',
                intro: 'Tanggal Tidak Valid.',
                message: 'Tanggal Reservasi sudah dibooking Pelanggan lain. Mohon pilih tanggal yang lain.'
              }
    
              return next();
            }
          }

          // Update data tanggal reservasi
          db.query(`UPDATE reservasi SET untuk_tanggal='${untuk_tgl}' WHERE id='${id_reservasi}'`, err => {
            if (err) return db.rollback(() => { throw err; });

            db.commit(err => {
              if (err) return db.rollback(() => { throw err; });

              req.session.messages = {
                type: 'success',
                intro: 'Tanggal Reservasi Berhasil Di Update',
                message: ''
              }
    
              return next();
            });
          });
        }
      }
    });
  });
}

module.exports = {
  readReservasi,
  readReservasiById,
  readTotalReservasi,
  validasiTanggalReservasi,
  checkStatusReservasi,
  updateDateReservasi,
};
