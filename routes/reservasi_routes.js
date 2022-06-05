const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const mejaServices = require('../services/meja_service');
const userChecker = require('../services/auth_service');

router.route('/reservasi')
    .get(reservasiServices.readReservasi, mejaServices.readMeja, (req, res) => {
        res.status(201).render('viewPelanggan/pages/pageReservasi', { dataReservasi: res.locals.allReservasi, dataMeja: res.locals.dataMeja });
    })
    .post(); // Route ini digunakan untuk keperluan pelanggan

router.route('/admin/reservasi')
    .get(userChecker.checkAuth, reservasiServices.readReservasi); // Route ini digunakan untuk keperluan admin/super-admin

module.exports = router;
