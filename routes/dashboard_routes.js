const express = require("express");
const menu_s = require("../services/menu_service");
const meja_s = require("../services/meja_service");

const router = express.Router();

// Read data menu & data meja
router.route("/dashboard")
.get(menu_s.readMenu, meja_s.readMeja, (req, res) => {
  res.status(200).render("pages/dashboard", { user: req.session.user, menu: res.locals.dataMenu, meja: res.locals.dataMeja });
});

module.exports = router;
