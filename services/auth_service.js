const db = require("../server");
const md5 = require("md5");

function checkAccount(req, res, next) {
  const { email_login, pass_login } = req.body;

  email_login !== null && md5(pass_login) !== null ?
    db.query(`SELECT email, role FROM users WHERE email='${email_login}' AND password='${pass_login}'`, (err, results) => {
      if (err) {
        res.send({ msg: err });
      }
      else if (!err) {
        if (results.length != 0) {
          console.log(results);
          res.locals.roleUsr = results[0].role;
          next();
        }
        else if (results.length === 0) {
          console.log("Unauthorized: Tidak dikenal");
          res.redirect("/login");
        }
      }
    }) : res.send("Username & Password Kosong!");
}

function logIn(req, res, next) {
  req.session.loggedIn = true;
  req.session.user = res.locals.roleUsr;
  res.redirect(`/dashboard`);
}

module.exports = { checkAccount, logIn };
