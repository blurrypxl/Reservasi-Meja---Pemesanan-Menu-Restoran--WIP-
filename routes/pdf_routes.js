const router = require('express').Router();
const pdfServices = require('../services/pdf_service');
const transaksiServices = require('../services/transaksi_service');
const pemesananServices = require('../services/pemesanan_service');
const reservasiServices = require('../services/reservasi_service');
const userChecker = require('../services/auth_service');

router.route('/admin/docs/pdf-transaksi')
  .post(userChecker.checkAuth, transaksiServices.readTransaksi, pemesananServices.readPesanan, pdfServices.createPdfTransaksi);

router.route('/admin/docs/pdf-reservasi')
  .post(userChecker.checkAuth, reservasiServices.readDetailReservasi, pemesananServices.readPesanan, pdfServices.createPdfReservasi);

router.route('/docs/pdf-invoice-pelanggan/:id')
  .post(transaksiServices.readNotaPembayaran, pdfServices.createPdfInvoicePelanggan);

router.route('/docs/pdf-bukti-reservasi/:id')
  .post(transaksiServices.readBuktiTransaksi, pemesananServices.readPesanan, pdfServices.createPdfBuktiReservasi);

module.exports = router;
