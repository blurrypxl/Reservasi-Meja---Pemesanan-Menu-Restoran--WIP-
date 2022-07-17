const db = require('../server');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');
const uploadsServices = require('../services/uploads_services');

function readNotaPembayaran(req, res, next) {
  const idPelanggan = req.params.id;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT pesanan.id, menu.nama_menu, pesanan.qty, pesanan.total_harga FROM pesanan JOIN pelanggan ON pesanan.id_pelanggan = pelanggan.id JOIN menu ON pesanan.id_menu = menu.id WHERE pelanggan.id='${idPelanggan}'`, (err, dataPesanan) => {
      if (err) return db.rollback(() => { throw err; });
      
      let total = 0;

      dataPesanan.forEach(item => {
        total += parseInt(item.total_harga);
      });

      res.locals.dataPesanan = dataPesanan;
      res.locals.total = total;
  
      db.query(`SELECT reservasi.id, reservasi.id_pelanggan, pelanggan.nama_pelanggan, pelanggan.id_meja, meja.nomor_meja, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi FROM reservasi JOIN pelanggan ON reservasi.id_pelanggan = pelanggan.id JOIN meja ON pelanggan.id_meja = meja.id WHERE reservasi.id_pelanggan='${idPelanggan}'`, (err, dataReservasi) => {
        if (err) return db.rollback(() => { throw err; });

        res.locals.dataReservasi = dataReservasi;

        next();
      });
    });
  });
}

function readTotalTransaksi(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM transaksi`, (err, totalTransaksi) => {
    if (err) throw err;

    res.locals.totalTransaksi = totalTransaksi;

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
  
          db.query(`UPDATE reservasi SET status_reservasi='Menunggu Validasi', update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id='${idReservasi}'`, err => {
            if (err) return db.rollback(() => { throw err; });
  
            db.commit(err => {
              if (err) return db.rollback(() => { throw err; });
              
              req.session.messages = {
                type: 'success',
                intro: 'Reservasi & Pemesanan Berhasil!',
                message: 'Bukti transfer anda sedang diperiksa. Silahkan cek Email anda secara berkala.'
              }

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

function updateBuktiTransaksi(req, res, next) {
  const idReservasi = req.params.id;
  
  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT bukti FROM bukti_transfer WHERE id_reservasi='${idReservasi}'`, (err, dataBukti) => {
      if (err) return db.rollback(() => { throw err; });

      // console.log(dataBukti);

      const reqBukti = req.file === undefined ? dataBukti[0].bukti : req.file.filename;
      
      if (req.file !== undefined) uploadsServices.removeImageFromDisk(req.file.destination + '/' + dataBukti[0].bukti); // Hapus Gambar dari Folder Images pada disk penyimpanan
      
      db.query(`UPDATE bukti_transfer SET bukti='${reqBukti}', update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id_reservasi='${idReservasi}'`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          next();
        });
      });
    });
  });
}

function readTransaksi(req, res, next) {
  db.query(`SELECT transaksi.id AS id_transaksi, users.id AS id_user, users.nama AS nama_user, users.role, transaksi.id_bukti, bukti_transfer.bukti, transaksi.metode_pembayaran, transaksi.total_transaksi, transaksi.status_transaksi, transaksi.create_at, reservasi.id AS id_reservasi, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi, pelanggan.id AS id_pelanggan, pelanggan.nama_pelanggan FROM transaksi JOIN users ON users.id=transaksi.id_user JOIN bukti_transfer ON bukti_transfer.id=transaksi.id_bukti JOIN reservasi ON reservasi.id=bukti_transfer.id_reservasi JOIN pelanggan ON pelanggan.id=reservasi.id_pelanggan`, (err, dataTransaksi) => {
    if (err) throw err;

    res.locals.dataTransaksi = dataTransaksi;

    next();
  });
}

function createTransaksi(req, res, next) {
  const idAdmin = req.session.idUsr;
  const idBukti = req.params.id;
  const idTransaksi = 'TRS-' + gUniqId({ length: 7 });

  console.log('ID Bukti Transfer: '+idBukti);

  db.beginTransaction(err => {
    if (err) throw err;

    // Mendapatkan ID Reservasi berdasarkan ID Bukti Transfer
    db.query(`SELECT id_reservasi FROM bukti_transfer WHERE id='${idBukti}'`, (err, idReservasi) => {
      if (err) return db.rollback(() => { throw err; });

      console.log('ID Reservasi: '+idReservasi[0].id_reservasi);

      // Mendapatkan ID Pelanggan berdasarkan ID Reservasi
      db.query(`SELECT id_pelanggan FROM reservasi WHERE id='${idReservasi[0].id_reservasi}'`, (err, idPelanggan) => {
        if (err) return db.rollback(() => { throw err; });

        console.log('ID Pelanggan: '+idPelanggan[0].id_pelanggan);

        // Mendapatkan Total Pesanan berdasarkan ID Pelanggan
        db.query(`SELECT total_harga FROM pesanan WHERE id_pelanggan='${idPelanggan[0].id_pelanggan}'`, (err, dataPesanan) => {
          if (err) return db.rollback(() => { throw err; });

          let total = 0;
          for (let i = 0; i < dataPesanan.length; i++) {
            total += parseInt(dataPesanan[i].total_harga);
          }

          // console.log(dataPesanan);
          // console.log(total);

          // Menyimpan data transaksi kedalam database
          db.query(`INSERT INTO transaksi (id, id_user, id_bukti, metode_pembayaran, total_transaksi, status_transaksi, create_at, update_at) VALUES ('${idTransaksi}', '${idAdmin}', '${idBukti}', 'transfer', '${total}', 'valid', '${timestamp('HH:mm:YYYY-MM-DD')}', '${timestamp('HH:mm:YYYY-MM-DD')}')`, err => {
            if (err) return db.rollback(() => { throw err; });

            db.commit(err => {
              if (err) return db.rollback(() => { throw err; });

              console.log('Data Transaksi berhasil dibuat');

              next();
            });
          });
        });
      });
    });
  });
}

module.exports = {
  readNotaPembayaran,
  readTotalTransaksi,
  downloadBuktiTransaksi,
  createBuktiTransaksi,
  readBuktiTransaksi,
  updateBuktiTransaksi,
  readTransaksi,
  createTransaksi
};
