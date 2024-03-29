const multer = require('multer');
const timestamp = require('time-stamp');
const path = require('path');
const fs = require('fs');

function removeImageFromDisk(path) {
  fs.unlink(path, err => {
    if (err) throw err;

    return;
  });
}

function filterToImg(req, file, cb) {
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
    return cb(null, true);
  }
  else if (file.mimetype != 'image/jpg' || file.mimetype != 'image/png' || file.mimetype != 'image/jpeg') {
    return cb(null, false, new Error('Only .png, .jpg and .jpeg format allowed.'));
  }
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

const saveBuktiToStorage = multer({ storage: buktiTransaksiConf, fileFilter: filterToImg }).single('bukti_transaksi');
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

const SaveGambarMenuToStorage = multer({ storage: gambarMenuConf, fileFilter: filterToImg }).single('gambar_menu');
// Uploads Gambar Menu - END

module.exports = {
  removeImageFromDisk,
  saveBuktiToStorage,
  SaveGambarMenuToStorage
};
