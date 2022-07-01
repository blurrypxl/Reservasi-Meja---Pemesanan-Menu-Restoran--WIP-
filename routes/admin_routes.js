const router = require('express').Router();
const adminServices = require('../services/admin_service');
const userChecker = require('../services/auth_service');

router.route('/admin/users')
  .get(userChecker.checkAuth, adminServices.readAdmin, (req, res) => {
    res.render('viewAdmin/pages/pageAdmin', { user: req.session.user, dataAdmin: res.locals.dataAdmin, });
  })
  .post(userChecker.checkAuth, adminServices.createAdmin, (req, res) => {
    res.redirect('/admin/users');
  });

router.route('/admin/users/:id')
  .put(userChecker.checkAuth, adminServices.updateAdmin, (req, res) => {
    res.redirect('/admin/users');
  })
  .delete(userChecker.checkAuth, adminServices.deleteAdmin, (req, res) => {
    res.redirect('/admin/users');
  });

module.exports = router;