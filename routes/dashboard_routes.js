const router = require("express").Router();
const menu_s = require("../services/menu_service");
const meja_s = require("../services/meja_service");
const userChecker = require("../services/auth_service");

// Read data menu & data meja
router.route("/admin")
  .get(userChecker.checkAuth, menu_s.readMenu, meja_s.readMeja, (req, res) => {
    res.status(200).render("viewAdmin/pages/dashboard", { user: req.session.user });
  });

module.exports = router;
