const router = require('express').Router();
const mejaServices = require("../services/meja_service");
const userChecker = require('../services/auth_service');

function toPageMeja(req, res) {
  res.status(200).redirect("/products-meja");
}

router.route("/products-meja")
  .get(userChecker.checkAuth, mejaServices.readMeja, (req, res) => {
    res.status(200).render("pages/pageMeja", { meja: res.locals.dataMeja });
  })
  .post(userChecker.checkAuth, mejaServices.createMeja, toPageMeja);

// router.route("/products-meja/:id")
//   .put(mejaServices.updateMeja, toPageMeja)
//   .delete(mejaServices.deleteMeja, toPageMeja);

module.exports = router;
