const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const transaksiServices = require('../services/transaksi_service');
const pemesananServices = require('../services/pemesanan_service');
const emailServices = require('../services/email_service');
const userChecker = require('../services/auth_service');

router.route('/admin/transaksi')
  .get(userChecker.checkAuth, transaksiServices.readTransaksi, pemesananServices.readPesanan, (req, res) => {
    res.render('viewAdmin/pages/pageTransaksi', { user: req.session.user, dataTransaksi: res.locals.dataTransaksi, dataPesanan: res.locals.dataPesanan });
  });

router.route('/admin/validasi-transaksi')
  .get(userChecker.checkAuth, transaksiServices.readBuktiTransaksi, (req, res) => {
    res.render('viewAdmin/pages/pageValidasiTransaksi', { user: req.session.user, dataDetailReservasi: res.locals.detailReservasi });
  });

router.route('/admin/validasi-transaksi/:id')
  .put(userChecker.checkAuth, reservasiServices.updateStatusReservasi, transaksiServices.readBuktiTransaksi, pemesananServices.readPesanan, (req, res, next) => {
    let reqSubject;
    let reqMessage;

    if (res.locals.validator === 'valid') {
      reqSubject = 'BUKTI VALIDASI RESERVASI';
      reqMessage = 'views/templateEmail/pageEmailBuktiReservasi.ejs';
    }
    else if (res.locals.validator === 'tidak-valid') {
      reqSubject = 'BUKTI TRANSFER TIDAK VALID';
      reqMessage = 'views/templateEmail/pageEmailUpdateBukti.ejs';
    }

    res.locals.configMessage = {
      email_pelanggan: res.locals.email,
      priority: 'high',
      subject: reqSubject,
      message: reqMessage,
      validator: res.locals.validator
    }

    next();
  }, emailServices.createMessageConfig, (req, res, next) => {
    console.log(res.locals.validator);

    // res.locals.sendMail;

    if (res.locals.validator === 'valid') {
      next();
    }
    else if (res.locals.validator === 'tidak-valid') {
      res.redirect('/admin/validasi-transaksi');
    }    
  }, transaksiServices.createTransaksi, (req, res) => { 
    res.redirect('/admin/validasi-transaksi');
  });

router.route('/admin/download/bukti-transaksi/:id')
  .post(userChecker.checkAuth, transaksiServices.downloadBuktiTransaksi, (req, res) => {
    res.redirect('/admin/download/bukti-transaksi/' + res.locals.idBukti);
  })
  .get(userChecker.checkAuth, (req, res) => {
    res.locals.download = req.session.download;
    
    delete req.session.download;

    res.download(res.locals.download);
  });

module.exports = router;