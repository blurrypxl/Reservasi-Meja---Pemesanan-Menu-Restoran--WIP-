const router = require('express').Router();
const pemesananServices = require('../services/pemesanan_service');

router.route('/konfirmasi-pesanan')
  .post(pemesananServices.createReservasiDanPesanan, (req, res) => {
    res.render('viewPelanggan/pages/pageFormTransaksi');
  });

module.exports = router;
