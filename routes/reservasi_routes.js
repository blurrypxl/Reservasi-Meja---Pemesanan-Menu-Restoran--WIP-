const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const mejaServices = require('../services/meja_service');
const menuServices = require('../services/menu_service');
const userChecker = require('../services/auth_service');

// Route ini digunakan untuk keperluan pelanggan
router.route('/reservasi')
    .get(reservasiServices.readReservasi, mejaServices.readMeja, (req, res) => {
        res.render('viewPelanggan/pages/pageReservasi', { dataReservasi: res.locals.allReservasi, dataMeja: res.locals.dataMeja });
    });

router.route('/pemesanan')
    .post(reservasiServices.validasiTanggalReservasi, menuServices.readMenu, (req, res) => {
        if (res.locals.errMsgValidasi === undefined) {
            res.render('viewPelanggan/pages/pageFormReservasi', { dataTglReservasi: res.locals.validasiReservasi, dataMenu: res.locals.dataMenu });
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

// Route ini digunakan untuk keperluan admin/super-admin
router.route('/admin/reservasi')
    .get(userChecker.checkAuth, reservasiServices.readReservasi);

module.exports = router;
