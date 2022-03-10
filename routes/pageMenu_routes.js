const express = require("express");
const menu_s = require("../services/menu_service");

const router = express.Router();

function toPageMenu(req, res) {
  res.status(200).redirect("/products-menu");
}

router.route("/products-menu")
.get(menu_s.readMenu, (req, res) => {
  res.status(200).render("pages/pageMenu", { user: req.session.user, menu: res.locals.dataMenu });
})
.post(menu_s.createMenu, toPageMenu);

router.route("/products-menu/:id")
.put(menu_s.updateMenu, toPageMenu)
.delete(menu_s.deleteMenu, toPageMenu);

module.exports = router;
