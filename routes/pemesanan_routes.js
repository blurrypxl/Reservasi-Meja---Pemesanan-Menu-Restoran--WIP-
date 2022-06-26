const router = require('express').Router();
const pemesananServices = require('../services/pemesanan_service');
const transaksiServices = require('../services/transaksi_service');

router.route('/transaksi-api')
  .post(pemesananServices.createReservasiDanPesanan, (req, res) => {
    res.redirect('/konfirmasi-transaksi/'+res.locals.id);
  });

router.route('/konfirmasi-transaksi/:id')
  .get(transaksiServices.readPesananById, (req, res) => {
    res.render('viewPelanggan/pages/pageFormTransaksi', { dataPesanan: res.locals.dataPesanan, dataReservasi: res.locals.dataReservasi });
  });

module.exports = router;
