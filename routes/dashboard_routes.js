const router = require("express").Router();
const menuServices = require("../services/menu_service");
const mejaServices = require("../services/meja_service");
const userChecker = require("../services/auth_service");

// Read data menu & data meja
router.route("/admin/dashboard")
  .get(userChecker.checkAuth, menuServices.readMenu, mejaServices.readMeja, (req, res) => {
    res.status(200).render("viewAdmin/pages/dashboard", { user: req.session.user });
  });

module.exports = router;
