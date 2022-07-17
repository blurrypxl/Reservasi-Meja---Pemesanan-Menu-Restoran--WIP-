const db = require("../server");
const gUniqId = require('generate-unique-id');
const timestamp = require("time-stamp");
const uploadServices = require('../services/uploads_services');

function readReservasi(req, res, next) {
  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE reservasi.status_reservasi = 'Menunggu Kedatangan Tamu' OR reservasi.status_reservasi = 'Menunggu Pembayaran' OR reservasi.status_reservasi = 'Menunggu Validasi' OR reservasi.status_reservasi = 'Menunggu Validasi Ulang'`, (err, results) => {
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

function readDetailReservasi(req, res, next) {
  db.query(`SELECT pelanggan.id AS id_pelanggan, pelanggan.nama_pelanggan, meja.nomor_meja, reservasi.id AS id_reservasi, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi, reservasi.create_at, reservasi.update_at FROM reservasi JOIN pelanggan ON pelanggan.id=reservasi.id_pelanggan JOIN meja ON meja.id=pelanggan.id_meja`, (err, dataReservasi) => {
    if (err) throw err;

    // console.log(dataReservasi);

    res.locals.dataReservasi = dataReservasi;

    next();
  });
}

function readValidReservasi(req, res, next) {
  db.query(`SELECT bukti_transfer.id AS id_transfer, reservasi.id AS id_reservasi, pelanggan.nama_pelanggan, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi, bukti_transfer.bukti, reservasi.update_at FROM bukti_transfer JOIN reservasi ON reservasi.id = bukti_transfer.id_reservasi JOIN pelanggan ON pelanggan.id = reservasi.id_pelanggan WHERE reservasi.status_reservasi = 'Menunggu Kedatangan Tamu' ORDER BY reservasi.update_at ASC`, (err, validReservasi) => {
    if (err) throw err;

    res.locals.validReservasi = validReservasi;

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

  db.query(`SELECT reservasi.id AS id_reservasi, reservasi.id_pelanggan, pelanggan.nama_pelanggan, meja.id AS id_meja, meja.nomor_meja, reservasi.email, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan=pelanggan.id JOIN meja ON pelanggan.id_meja=meja.id WHERE reservasi.id='${idReservasi}' AND (reservasi.status_reservasi='Menunggu Pembayaran' OR reservasi.status_reservasi='Menunggu Kedatangan Tamu' OR reservasi.status_reservasi='Menunggu Validasi' OR reservasi.status_reservasi='Menunggu Validasi Ulang')`, (err, dataReservasi) => {
    if (err) throw err;

    res.locals.dataReservasi = dataReservasi;
    res.locals.idPelanggan = dataReservasi.map(idP => idP.id_pelanggan); //get id pelanggan

    // console.log(res.locals.dataReservasi);

    next();
  });
}

function validasiTanggalReservasi(req, res, next) {
  const { nama, email, id_meja, nomor_meja, untuk_tgl } = req.body;
  const tglReservasi = untuk_tgl === '' || untuk_tgl === undefined ? timestamp('YYYY-MM-DD') : untuk_tgl;
  const idPelanggan = "PLG-" + gUniqId({ length: 7 });

  db.query(`SELECT pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id WHERE pelanggan.id_meja = '${id_meja}' AND (reservasi.status_reservasi = '${"Menunggu Kedatangan Tamu"}' OR reservasi.status_reservasi = '${"Menunggu Pembayaran"}' OR reservasi.status_reservasi='Menunggu Validasi Ulang' OR reservasi.status_reservasi='Menunggu Validasi')`, (err, results) => {
    if (err) throw err; // Tampilkan Error

    // console.log(results);

    const tglHariIni = new Date(timestamp("YYYY-MM-DD")).setHours(0, 0, 0, 0);

    // menyaring reservasi terbaru & reservasi dengan tanggal yang sama
    const filterReservasi = [];

    for (let i = 0; i < results.length; i++) {
      if (new Date(results[i].untuk_tanggal).setHours(0, 0, 0, 0) >= tglHariIni) {
        if (results[i].untuk_tanggal === tglReservasi) {
          filterReservasi.push(results[i].untuk_tanggal);
        }
      }
    }

    // console.log('panjang isi filter reservasi = '+ filterReservasi.length);
    // console.log(filterReservasi);

    if (filterReservasi.length === 0) {
      req.session.validasiReservasi = [idPelanggan, nama, email, id_meja, nomor_meja, tglReservasi];

      return next();
    }
    else if (filterReservasi.length > 0) {
      res.locals.errMsgValidasi = 'Meja ini sudah direservasi oleh pelanggan lain. Silahkan pilih Nomor Meja yang berbeda atau pilih lain hari.';

      return next();
    }
  });
}

function updateStatusReservasi(req, res, next) {
  const idTransfer = req.params.id;
  const statusReservasi = req.body.status;
  const reqStatus = (statusReservasi) => {
    if (statusReservasi === 'valid') {
      return statusReservasi = 'Menunggu Kedatangan Tamu';
    }
    else if (statusReservasi === 'tidak-valid') {
      return statusReservasi = 'Menunggu Validasi Ulang';
    }
    else if (statusReservasi === 'selesai') {
      return statusReservasi = 'Selesai';
    }
  };

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT bukti_transfer.id_reservasi, reservasi.email FROM bukti_transfer JOIN reservasi ON bukti_transfer.id_reservasi = reservasi.id WHERE bukti_transfer.id='${idTransfer}'`, (err, dataReservasi) => {
      if (err) return db.rollback(() => { throw err; });

      // console.log(dataReservasi);

      db.query(`UPDATE reservasi SET status_reservasi='${reqStatus(statusReservasi)}', update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id='${dataReservasi[0].id_reservasi}'`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          res.locals.validator = statusReservasi;
          res.locals.email = dataReservasi[0].email;

          // console.log(res.locals.validator, res.locals.email);

          next();
        });
      });
    });
  });
}

function checkStatusReservasi(req, res, next) {
  const idReservasi = req.body.id_reservasi === '' || req.body.id_reservasi === undefined ? req.params.id : req.body.id_reservasi;

  console.log(idReservasi);

  db.query(`SELECT * FROM reservasi WHERE id='${idReservasi}' AND (status_reservasi='Menunggu Pembayaran' OR status_reservasi='Menunggu Kedatangan Tamu' OR status_reservasi='Menunggu Validasi' OR status_reservasi='Menunggu Validasi Ulang')`, (err, dataReservasi) => {
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

  // console.log(untuk_tgl);

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT reservasi.id AS id_reservasi, reservasi.id_pelanggan, pelanggan.id_meja, reservasi.untuk_tanggal FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan=pelanggan.id WHERE pelanggan.id_meja='${id_meja}'`, (err, dataReservasi) => {
      if (err) return db.rollback(() => { throw err; });

      res.locals.idReservasi = id_reservasi;

      for (let i = 0; i < dataReservasi.length; i++) {
        reqData = {
          tgl: untuk_tgl === '' ? dataReservasi[i].untuk_tanggal : untuk_tgl
        }

        if (id_reservasi === dataReservasi[i].id_reservasi) {
          // Memvalidasi tanggal reservasi
          for (let x = 0; x < dataReservasi.length; x++) {
            if (reqData.tgl === dataReservasi[x].untuk_tanggal) {
              req.session.messages = {
                type: 'warning',
                intro: 'Tanggal Tidak Valid.',
                message: 'Tanggal Reservasi sudah dibooking Pelanggan lain. Mohon pilih tanggal yang lain.'
              }
    
              return next();
            }
          }

          // Update data tanggal reservasi
          db.query(`UPDATE reservasi SET untuk_tanggal='${reqData.tgl}', update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id='${id_reservasi}'`, err => {
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

function validasiUpdateReservasi(req, res, next) {
  const idPelanggan = req.params.id;

  db.query(`SELECT * FROM reservasi WHERE id_pelanggan='${idPelanggan}' AND (status_reservasi='Selesai' OR status_reservasi='Menunggu Kedatangan Tamu')`, (err, dataValidasi) => {
    if (err) throw err;

    if (dataValidasi.length !== 0) {
      req.session.messages = {
        type: 'danger',
        intro: 'Data Reservasi Sudah Valid atau Sudah Tidak Berlaku!',
        message: ''
      }

      return next();
    }

    return next();
  });
}

function deleteReservasi(req, res, next) {
  const idPelanggan = req.params.id;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT id AS id_reservasi FROM reservasi WHERE id_pelanggan='${idPelanggan}'`, (err, dataReservasi) => {
      if (err) return db.rollback(() => { throw err; });

      const idReservasi = dataReservasi[0].id_reservasi;

      // Mendapatkan data bukti dari database
      db.query(`SELECT bukti FROM bukti_transfer WHERE id_reservasi='${idReservasi}'`, (err, dataTransfer) => {
        if (err) return db.rollback(() => { throw err; });

        // Memeriksa ketersediaan data bukti transfer
        if (dataTransfer.length !== 0) {
          const filePath = 'public/uploads/bukti-transaksi/' + dataTransfer[0].bukti;

          // Menghapus bukti transfer dari storage
          uploadServices.removeImageFromDisk(filePath);
        }
      });

      // Menghapus data pelanggan dan kawan-kawannya
      db.query(`DELETE FROM pelanggan WHERE id='${idPelanggan}'`, err => {
        if (err) return db.rollback(() => { throw err; });
      });
    
      next();
    });
  });
}

module.exports = {
  readReservasi,
  readDetailReservasi,
  readReservasiById,
  readValidReservasi,
  readTotalReservasi,
  validasiTanggalReservasi,
  checkStatusReservasi,
  updateStatusReservasi,
  updateDateReservasi,
  validasiUpdateReservasi,
  deleteReservasi,
};
