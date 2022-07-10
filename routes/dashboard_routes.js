const router = require("express").Router();
const menuServices = require("../services/menu_service");
const mejaServices = require("../services/meja_service");
const adminServices = require("../services/admin_service");
const reservasiServices = require("../services/reservasi_service");
const transaksiServices = require("../services/transaksi_service");
const userChecker = require("../services/auth_service");

// Read data menu & data meja
router.route("/admin/dashboard")
  .get(userChecker.checkAuth, menuServices.readMenu, mejaServices.readTotalMeja, menuServices.readTotalMenu, adminServices.readTotalAdmin, reservasiServices.readTotalReservasi, transaksiServices.readTotalTransaksi, (req, res) => {
    res.render("viewAdmin/pages/dashboard", {
      user: req.session.user,
      totalMeja: res.locals.totalMeja,
      totalMenu: res.locals.totalMenu,
      totalAdmin: res.locals.totalAdmin,
      totalReservasi: res.locals.totalReservasi,
      totalTransaksi: res.locals.totalTransaksi
    });
  });

module.exports = router;
