const router = require('express').Router();
const db = require('../server');
const gUniqId = require('generate-unique-id');
const uploads = require('../services/uploads_services');
const pemesananServices = require('../services/pemesanan_service');
const transaksiServices = require('../services/transaksi_service');
const timestamp = require('time-stamp');

router.route('/transaksi-api')
  .post(pemesananServices.createReservasiDanPesanan, (req, res) => {
    res.redirect('/konfirmasi-transaksi/'+res.locals.id);
  });

router.route('/konfirmasi-transaksi/:id')
  .get(transaksiServices.readPesananById, (req, res) => {
    res.render('viewPelanggan/pages/pageFormTransaksi', { dataPesanan: res.locals.dataPesanan, dataReservasi: res.locals.dataReservasi, totalBayar: res.locals.total });
  })
  .post(uploads.buktiTransaksi.single('bukti_transaksi'), (req, res) => {
    if (!req.file) {
      console.log("No File Uploaded!"); //logs bukti transaksi yang tidak dapat diupload

      res.redirect('/konfirmasi-transaksi/'+req.params.id);
    }
    else if (req.file) {
      const idReservasi = req.body.idReservasi;
      const idBukti = 'BKT-'+gUniqId({ length: 7 });
      const fileBukti = req.file.filename.toString();

      // console.log(req.body);
      // console.log(req.body.idReservasi);
      // console.log(idReservasi);
      console.log(fileBukti);

      db.query(`INSERT INTO bukti_transfer (id, id_reservasi, bukti, create_at, update_at) VALUES ('${idBukti}', '${idReservasi}', '${fileBukti}', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
        if (err) throw err;

        console.log('Upload Success!');
      });

      // res.redirect('/reservasi');
    }
  });

module.exports = router;
