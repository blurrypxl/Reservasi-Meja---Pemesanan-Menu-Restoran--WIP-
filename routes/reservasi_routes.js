const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
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
    res.render('viewPelanggan/pages/pageFormReservasi', { dataTglReservasi: req.session.validasiReservasi, dataMenu: res.locals.dataMenu });
  })
  .post(reservasiServices.validasiTanggalReservasi, (req, res) => {
    if (res.locals.errMsgValidasi === undefined) {
      res.redirect('/pemesanan');
    } else if (res.locals.errMsgValidasi !== undefined) {
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

module.exports = router;
