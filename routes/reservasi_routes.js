const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const transaksiServices = require('../services/transaksi_service');
const pemesananServices = require('../services/pemesanan_service');
const menuServices = require('../services/menu_service');
const mejaServices = require('../services/meja_service');
const userChecker = require('../services/auth_service');

// Route ini digunakan untuk keperluan pelanggan
router.route('/reservasi')
  .get(reservasiServices.readReservasi, mejaServices.readMeja, (req, res) => {
    res.render('viewPelanggan/pages/pageReservasi', { dataReservasi: res.locals.allReservasi, dataMeja: res.locals.dataMeja });
  });

router.route('/api/update-reservasi')
  .post(reservasiServices.checkStatusReservasi, (req, res) => {
    // console.log(req.session.messages);

    if (req.session.messages) {
      res.redirect('/reservasi');
    }
    else if (!req.session.messages) {
      res.redirect('/reservasi/' + res.locals.idReservasi);
    }
  });

router.route('/reservasi/:id')
  .get(reservasiServices.readReservasiById, pemesananServices.readPesananById, (req, res) => {
    res.render('viewPelanggan/pages/pageUpdateReservasi', { dataReservasi: res.locals.dataReservasi, dataPesanan: res.locals.dataPesanan, ttlHargaPesanan: res.locals.ttlHargaPesanan });
  })
  .put(reservasiServices.updateDateReservasi, (req, res) => {
    // console.log(req.session.messages);

    if (req.session.messages.type === 'warning') {      
      res.redirect('/reservasi/' + res.locals.idReservasi);
    }
    else if (req.session.messages.type === 'success') {
      res.redirect('/reservasi');
    }
  });

router.route('/pemesanan')
  .get(menuServices.readMenu, (req, res) => {
    if (req.session.validasiReservasi) {
      res.render('viewPelanggan/pages/pageFormReservasi', { dataTglReservasi: req.session.validasiReservasi, dataMenu: res.locals.dataMenu });
    }
    else if (!req.session.validasiReservasi) {
      res.redirect('/reservasi');
    }
  })
  .post(reservasiServices.validasiTanggalReservasi, (req, res) => {
    if (res.locals.errMsgValidasi === undefined) {
      res.redirect('/pemesanan');
    }
    else if (res.locals.errMsgValidasi !== undefined) {
      // Object untuk Flash Messages
      req.session.messages = {
        type: 'danger',
        intro: 'Tanggal Reservasi Tidak Valid.',
        message: res.locals.errMsgValidasi
      }

      res.redirect('/reservasi');
    }
  });

// Route ini digunakan untuk keperluan admin & super-admin
router.route('/admin/reservasi')
  .get(userChecker.checkAuth, reservasiServices.readDetailReservasi, pemesananServices.readPesanan, (req, res) => {
    res.render('viewAdmin/pages/pageReservasiAdmin', { user: req.session.user, dataReservasi: res.locals.dataReservasi, dataPesanan: res.locals.dataPesanan });
  });

router.route('/admin/reservasi/:id')
  .delete(reservasiServices.deleteReservasi, (req, res) => {
    res.redirect('/admin/reservasi');
  });

router.route('/admin/konfirmasi-reservasi')
  .get(userChecker.checkAuth, reservasiServices.readValidReservasi, (req, res) => {
    res.render('viewAdmin/pages/pageKonfirmasiReservasi', { user: req.session.user, dataValidReservasi: res.locals.validReservasi });
  });

router.route('/admin/konfirmasi-reservasi/:id')
  .put(userChecker.checkAuth, reservasiServices.updateStatusReservasi, (req, res) => {
    res.redirect('/admin/konfirmasi-reservasi');
  });

module.exports = router;
