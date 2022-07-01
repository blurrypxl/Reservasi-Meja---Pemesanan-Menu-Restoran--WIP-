const db = require("../server");
const md5 = require("md5");

function checkAccount(req, res, next) {
  const { email_login, pass_login } = req.body;

  email_login !== null && md5(pass_login) !== null ?
    db.query(`SELECT id, email, role, status FROM users WHERE email='${email_login}' AND password='${pass_login}'`, (err, results) => {
      if (err) {
        res.send({ msg: err });
      }
      else if (!err) {
        if (results.length != 0) {
          if (results[0].status === 'non-aktif' || results[0].status !== 'aktif') {
            console.log("Unauthorized: Akun Tidak Aktif");
          
            req.session.messages = {
              type: 'danger',
              intro: 'Akun non-aktif!',
              message: 'Silahkan hubungi super-admin untuk mengaktifkan akun.'
            };
  
            res.redirect('/admin/login');
          }
          else if (results[0].status === 'aktif') {
            console.log(results);
            res.locals.roleUsr = results[0].role;
            res.locals.idUsr = results[0].id;
            next();
          }
        }
        else if (results.length === 0) {
          console.log("Unauthorized: Tidak dikenal");
          
          req.session.messages = {
            type: 'danger',
            intro: 'Akun tidak dikenal!',
            message: 'Username atau Password salah! Silahkan coba lagi.'
          };
  
          res.redirect('/admin/login');
        }
      }
    }) : res.send("Username & Password Kosong!");
}

function logIn(req, res) {
  req.session.loggedIn = true;
  req.session.user = res.locals.roleUsr;
  req.session.idUsr = res.locals.idUsr;
  req.session.statusUsr = res.locals.statusUsr;
  res.redirect('/admin/dashboard');
}

function checkAuth(req, res, next) {
  // console.log(req.session.loggedIn);

  if (req.session.loggedIn === true) {
    next();
  }
  else if (req.session.loggedIn !== true) {
    res.redirect('/admin/login');
  }
}

module.exports = {
  checkAccount,
  logIn,
  checkAuth
};
