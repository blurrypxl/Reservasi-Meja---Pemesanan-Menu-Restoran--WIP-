const router = require("express").Router();
const menuServices = require("../services/menu_service");
// const userChecker = require('../services/auth_service');

function toPageMenu(req, res) {
  res.status(200).redirect("/products-menu");
}

router.route("/products-menu")
.get(menuServices.readMenu, (req, res) => {
  res.status(200).render("pages/pageMenu", { user: req.session.user, menu: res.locals.dataMenu });
})
.post(menuServices.createMenu, toPageMenu);

router.route("/products-menu/:id")
.put(menuServices.updateMenu, toPageMenu)
.delete(menuServices.deleteMenu, toPageMenu);

module.exports = router;
