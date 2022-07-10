const router = require('express').Router();
const uploadServices = require('../services/uploads_services');
const reservasiServices = require('../services/reservasi_service');
const userChecker = require('../services/auth_service');

router.route('/admin/validasi-transaksi')
  .get(userChecker.checkAuth, uploadServices.readBuktiTransaksi, (req, res) => {
    res.render('viewAdmin/pages/pageValidasiTransaksi', { user: req.session.user, dataDetailReservasi: res.locals.detailReservasi });
  });

router.route('/admin/validasi-transaksi/:id')
  .put(userChecker.checkAuth, reservasiServices.updateStatusReservasi, (req, res) => {
    res.redirect('/admin/validasi-transaksi');
  });

router.route('/admin/download/bukti-transaksi/:id')
  .post(userChecker.checkAuth, uploadServices.downloadBuktiTransaksi, (req, res) => {
    res.redirect('/admin/download/bukti-transaksi/' + res.locals.idBukti);
  })
  .get(userChecker.checkAuth, (req, res) => {
    res.locals.download = req.session.download;
    
    delete req.session.download;

    res.download(res.locals.download);
  });

module.exports = router;