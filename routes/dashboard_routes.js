const router = require("express").Router();
const menuServices = require("../services/menu_service");
const mejaServices = require("../services/meja_service");
const adminServices = require("../services/admin_service");
const userChecker = require("../services/auth_service");

// Read data menu & data meja
router.route("/admin/dashboard")
  .get(userChecker.checkAuth, menuServices.readMenu, mejaServices.readTotalMeja, menuServices.readTotalMenu, adminServices.readTotalAdmin, (req, res) => {
    res.status(200).render("viewAdmin/pages/dashboard", { user: req.session.user, totalMeja: res.locals.totalMeja, totalMenu: res.locals.totalMenu, totalAdmin: res.locals.totalAdmin, });
  });

module.exports = router;
