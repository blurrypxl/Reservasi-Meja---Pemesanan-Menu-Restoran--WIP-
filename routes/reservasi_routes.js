const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const mejaServices = require('../services/meja_service');
const userChecker = require('../services/auth_service');

// Route ini digunakan untuk keperluan pelanggan
router.route('/reservasi')
    .get(reservasiServices.readReservasi, mejaServices.readMeja, (req, res) => {
        res.status(201).render('viewPelanggan/pages/pageReservasi', { dataReservasi: res.locals.allReservasi, dataMeja: res.locals.dataMeja });
    });

router.route('/validasi-tgl-reservasi')
    .post(reservasiServices.validasiTanggalReservasi, (req, res) => {
        res.status(201).send({
            message: res.locals.validasiReservasi || res.locals.errMsgValidasi
        }); // NOTE: Untuk keperluan testing
    });

// Route ini digunakan untuk keperluan admin/super-admin
router.route('/admin/reservasi')
    .get(userChecker.checkAuth, reservasiServices.readReservasi);

module.exports = router;
