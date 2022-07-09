const router = require("express").Router();
const menuServices = require("../services/menu_service");
const userChecker = require('../services/auth_service');
const uploads = require('../services/uploads_services');

function toPageMenu(req, res) {
  res.redirect("/admin/menu");
}

router.route("/admin/menu")
  .get(userChecker.checkAuth, menuServices.readMenu, (req, res) => {
    res.render("viewAdmin/pages/pageMenu", { user: req.session.user, dataMenu: res.locals.dataMenu });
  })
  .post(userChecker.checkAuth, uploads.SaveGambarMenuToStorage, menuServices.createMenu, toPageMenu);

router.route("/admin/menu/:id")
  .put(userChecker.checkAuth, uploads.SaveGambarMenuToStorage, menuServices.updateMenu, toPageMenu)
  .delete(userChecker.checkAuth, menuServices.deleteMenu, toPageMenu);

module.exports = router;
