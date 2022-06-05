const router = require('express').Router();
const meja_s = require("../services/meja_service");

function toPageMeja(req, res) {
  res.status(200).redirect("/products-meja");
}

router.route("/products-meja")
.get(meja_s.readMeja, (req, res) => {
  res.status(200).render("pages/pageMeja", { meja: res.locals.dataMeja });
})
.post(meja_s.createMeja, toPageMeja);

router.route("/products-meja/:id")
.put(meja_s.updateMeja, toPageMeja)
.delete(meja_s.deleteMeja, toPageMeja);

module.exports = router;
