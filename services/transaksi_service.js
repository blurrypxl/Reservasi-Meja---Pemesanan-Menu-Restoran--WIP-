const db = require('../server');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');
const path = require('path');

function readNotaPembayaran(req, res, next) {
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

function readBuktiTransaksi(req, res, next) {
  db.query(`SELECT bukti_transfer.id AS id_transfer, reservasi.id AS id_reservasi, pelanggan.nama_pelanggan, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi, bukti_transfer.bukti, reservasi.update_at FROM bukti_transfer JOIN reservasi ON reservasi.id = bukti_transfer.id_reservasi JOIN pelanggan ON pelanggan.id = reservasi.id_pelanggan WHERE reservasi.status_reservasi = 'Menunggu Validasi' OR status_reservasi = 'Menunggu Validasi Ulang' ORDER BY reservasi.update_at ASC`, (err, detailReservasi) => {
    if (err) throw err;

    res.locals.detailReservasi = detailReservasi;

    next();
  });
}

function createBuktiTransaksi(req, res, next) {
  // console.log(req.file);
  // console.log(req.body);

  if (req.file === undefined) {
    console.log("No File Uploaded!"); //logs bukti transaksi yang tidak dapat diupload

    res.redirect('/konfirmasi-transaksi/' + req.params.id);
  }
  else if (req.file !== undefined) {
    const idReservasi = req.body.idReservasi;
    const idBukti = 'BKT-' + gUniqId({ length: 7 });
    const fileBukti = req.file.filename;

    // console.log(req.body);
    // console.log(req.body.idReservasi);
    // console.log(idReservasi);
    // console.log(fileBukti);

    db.beginTransaction(err => {
      if (err) throw err;

      db.query(`INSERT INTO bukti_transfer (id, id_reservasi, bukti, create_at, update_at) VALUES ('${idBukti}', '${idReservasi}', '${fileBukti}', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) db.rollback(() => { throw err; });

          console.log('Upload Success!');
  
          db.query(`UPDATE reservasi SET status_reservasi='Menunggu Validasi' update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id='${idReservasi}'`, err => {
            if (err) return db.rollback(() => { throw err; });
  
            db.commit(err => {
              if (err) return db.rollback(() => { throw err; });
              
              next();
            });
          });
        });
      });
    });
  }
}

function downloadBuktiTransaksi(req, res, next) {
  const idBukti = req.params.id;
  const photoBukti = req.body.bukti;
  const filePath = './public/uploads/bukti-transaksi/';

  // console.log(filePath);

  db.query(`SELECT id, bukti FROM bukti_transfer WHERE id='${idBukti}' AND bukti='${photoBukti}'`, (err, dataTransaksi) => {
    if (err) throw err;

    // console.log(dataTransaksi);

    res.locals.idBukti = idBukti;
    req.session.download = filePath + dataTransaksi[0].bukti;

    next();
  });
}

function updateBuktiTransaksi(req, res, next) {}

module.exports = {
  readNotaPembayaran,
  readTotalTransaksi,
  downloadBuktiTransaksi,
  createBuktiTransaksi,
  readBuktiTransaksi,
  updateBuktiTransaksi
};
