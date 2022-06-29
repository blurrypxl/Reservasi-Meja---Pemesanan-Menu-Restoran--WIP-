const router = require('express').Router();
const adminServices = require('../services/admin_service');
const userChecker = require('../services/auth_service');

router.route('/admin/users')
  .get(userChecker.checkAuth, adminServices.readAdmin, (req, res) => {
    res.render('viewAdmin/pages/pageAdmin', { user: req.session.user, dataAdmin: res.locals.dataAdmin, });
  })
  .post()
  .put()
  .delete();

module.exports = router;