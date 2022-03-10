const db = require("../server");
const md5 = require("md5");

function checkAccount(req, res, next) {
  const { email_login, pass_login } = req.body;

  email_login !== null && md5(pass_login) !== null ?
    db.query(`SELECT email, pass_admin, type FROM data_admin WHERE email='${email_login}' AND pass_admin='${md5(pass_login)}'`, (err, results) => {
      const dataUsr = results.map(item => item.type);

      if (err) {
        res.send({ msg: err });
      }
      else if (!err) {
        if (dataUsr.length != 0) {
          console.log([email_login, ...dataUsr]);
          res.locals.typeUsr = dataUsr[0];
          next();
        }
        else if (dataUsr.length == 0) {
          console.log("Unauthorized: Tidak dikenal");
          res.redirect("/login");
        }
      }
    }) : res.send("Username & Password Kosong!");
}

function logIn(req, res, next) {
  req.session.loggedIn = true;
  req.session.user = res.locals.typeUsr;
  res.redirect(`/dashboard`);
}

module.exports = { checkAccount, logIn };
