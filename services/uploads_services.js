const multer = require('multer');
const db = require('../server');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');
const path = require('path');
const fs = require('fs');

function removeImageFromDisk(path) {
  fs.unlink(path, err => {
    if (err) throw err;

    return;
  });
}

// Uploads Bukti Transaksi - START
const buktiTransaksiConf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/bukti-transaksi');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = timestamp('YYYY-MM-DD') + "-" + Math.round(Math.random() * 1E9);

    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const saveBuktiToStorage = multer({ storage: buktiTransaksiConf }).single('bukti_transaksi');

function readBuktiTransaksi(req, res, next) {
  db.query(`SELECT bukti_transfer.id AS id_transfer, reservasi.id AS id_reservasi, pelanggan.nama_pelanggan, reservasi.email, reservasi.untuk_tanggal, reservasi.status_reservasi, bukti_transfer.bukti FROM bukti_transfer JOIN reservasi ON reservasi.id = bukti_transfer.id_reservasi JOIN pelanggan ON pelanggan.id = reservasi.id_pelanggan WHERE reservasi.status_reservasi = 'Menunggu Validasi' ORDER BY bukti_transfer.update_at ASC`, (err, detailReservasi) => {
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
  
          db.query(`UPDATE reservasi SET status_reservasi = 'Menunggu Validasi' WHERE id='${idReservasi}'`, err => {
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

  console.log(filePath);

  db.query(`SELECT bukti_transfer.id AS id_bukti, reservasi.id AS id_reservasi, pelanggan.nama_pelanggan, reservasi.untuk_tanggal FROM bukti_transfer JOIN reservasi ON reservasi.id = bukti_transfer.id_reservasi JOIN pelanggan ON pelanggan.id = reservasi.id_pelanggan WHERE bukti_transfer.id='${idBukti}'`, (err, dataTransaksi) => {
    if (err) throw err;

    console.log(dataTransaksi);

    res.locals.idBukti = idBukti;
    req.session.download = filePath + photoBukti;

    // console.log(fileName);
    // console.log(path.extname(filePath));

    next();
  });
}

function updateBuktiTransaksi(req, res, next) {
  
}

function deleteBuktiTransaksi(req, res, next) {}
// Uploads Bukti Transaksi - END

// Uploads Gambar Menu - START
const gambarMenuConf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/menu');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = timestamp('YYYY-MM-DD') + "-" + Math.round(Math.random() * 1E9);

    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const SaveGambarMenuToStorage = multer({ storage: gambarMenuConf }).single('gambar_menu');
// Uploads Gambar Menu - END

module.exports = {
  removeImageFromDisk,
  saveBuktiToStorage,
  createBuktiTransaksi,
  readBuktiTransaksi,
  downloadBuktiTransaksi,
  updateBuktiTransaksi,
  SaveGambarMenuToStorage,
};
