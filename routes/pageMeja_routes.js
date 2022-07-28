const router = require('express').Router();
const mejaServices = require("../services/meja_service");
const userChecker = require('../services/auth_service');

function toPageMeja(req, res) {
  res.redirect("/admin/meja");
}

router.route("/admin/meja")
  .get(userChecker.checkAuth, mejaServices.readMeja, (req, res) => {
    res.render("viewAdmin/pages/pageMeja", { user: req.session.user, dataMeja: res.locals.dataMeja });
  })
  .post(userChecker.checkAuth, mejaServices.createMeja, toPageMeja);

router.route('/admin/meja/:id')
  .put(userChecker.checkAuth, mejaServices.updateMeja, toPageMeja);

module.exports = router;
