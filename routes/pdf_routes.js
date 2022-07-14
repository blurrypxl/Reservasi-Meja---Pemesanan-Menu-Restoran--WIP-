const router = require('express').Router();
const pdfServices = require('../services/pdf_service');
const transaksiServices = require('../services/transaksi_service');
const pesananServices = require('../services/pemesanan_service');
const userChecker = require('../services/auth_service');

router.route('/admin/docs/pdf-transaksi')
  .post(userChecker.checkAuth, transaksiServices.readTransaksi, pesananServices.readPesanan, pdfServices.createPdfTransaksi, (req, res) => {
    res.download(res.locals.downloadPDF);
  });

module.exports = router;
