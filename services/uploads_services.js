// TODO: Membuat Fungsi Upload Bukti

const multer = require('multer');
const timestamp = require('time-stamp');
const path = require('path');

const buktiTransaksiConf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/bukti-transaksi');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = timestamp('YYYY-MM-DD')+"-"+Math.round(Math.random() * 1E9);

    cb(null, file.fieldname+"-"+uniqueSuffix+path.extname(file.originalname));
  }
});

const buktiTransaksi = multer({ storage: buktiTransaksiConf });

module.exports = {
  buktiTransaksi,
};
