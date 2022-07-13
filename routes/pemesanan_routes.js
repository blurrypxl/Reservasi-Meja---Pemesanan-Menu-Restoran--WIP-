const router = require('express').Router();
const pemesananServices = require('../services/pemesanan_service');
const transaksiServices = require('../services/transaksi_service');
const reservasiServices = require('../services/reservasi_service');
const uploads = require('../services/uploads_services');

router.route('/api/transaksi')
  .post(pemesananServices.createReservasiDanPesanan, (req, res) => {
    if (req.session.messages) {
      res.redirect('/pemesanan');
    }
    else if (!req.session.messages) {
      res.redirect('/konfirmasi-transaksi/' + res.locals.id);
    }
  });

router.route('/konfirmasi-transaksi/:id')
  .get(transaksiServices.readNotaPembayaran, (req, res) => {
    res.render('viewPelanggan/pages/pageFormTransaksi', { dataPesanan: res.locals.dataPesanan, dataReservasi: res.locals.dataReservasi, totalBayar: res.locals.total });
  })
  .post(uploads.saveBuktiToStorage, transaksiServices.createBuktiTransaksi, (req, res) => {
    res.redirect('/reservasi');
  });

// TODO: TESTING VALIDASI halaman form update bukti transfer
router.route('/update-bukti-transaksi/:id')
  .get(reservasiServices.checkStatusReservasi, transaksiServices.readNotaPembayaran, (req, res) => {
    res.render('viewPelanggan/pages/pageUpdateFormTransaksi', { dataPesanan: res.locals.dataPesanan, dataReservasi: res.locals.dataReservasi, totalBayar: res.locals.total });
  })
  .put(reservasiServices.checkStatusReservasi, uploads.saveBuktiToStorage, transaksiServices.updateBuktiTransaksi, (req, res) => {
    res.redirect('/reservasi');
  });

module.exports = router;
