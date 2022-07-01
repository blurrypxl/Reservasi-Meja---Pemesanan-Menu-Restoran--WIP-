const multer = require('multer');
const db = require('../server');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');
const path = require('path');
// const fs = require('fs');

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
    const fileBukti = req.file.destination+'/'+req.file.filename;

    // console.log(req.body);
    // console.log(req.body.idReservasi);
    // console.log(idReservasi);
    // console.log(fileBukti);

    db.query(`INSERT INTO bukti_transfer (id, id_reservasi, bukti, create_at, update_at) VALUES ('${idBukti}', '${idReservasi}', '${fileBukti}', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
      if (err) throw err;

      console.log('Upload Success!');

      next();
    });
  }
}

function updateBuktiTransaksi(req, res, next) {}

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

// Uploads Gambar Meja - START
// Uploads Gambar Meja - END

module.exports = {
  saveBuktiToStorage,
  createBuktiTransaksi,
  SaveGambarMenuToStorage,
};
