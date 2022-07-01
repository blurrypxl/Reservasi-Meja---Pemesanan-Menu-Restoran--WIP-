const db = require('../server');
const timestamp = require('time-stamp');
const gUniqId = require('generate-unique-id');

function readAdmin(req, res, next) {
  db.query(`SELECT * FROM users WHERE role='admin' ORDER BY status='aktif' DESC`, (err, results) => {
    if (err) throw err;

    res.locals.dataAdmin = results;
    // console.log(res.locals.dataAdmin);

    next();
  });
}

function readTotalAdmin(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM users WHERE role='admin'`, (err, results) => {
    if (err) throw err;

    res.locals.totalAdmin = results;

    next();
  });
}

function createAdmin(req, res, next) {
  const { nama, email, alamat, password, status } = req.body;
  const idAdmin = 'ADM-'+gUniqId({ length: 7 });

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT email FROM users WHERE email='${email}'`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });

      if (results.length > 0) {
        req.session.messages = {
          type: 'danger',
          intro: 'Duplikasi Email',
          message: 'Alamat email yang ada masukan sudah terdaftar di database. Silahkan pastikan, anda belum melakukankan pendaftaran sebelumnya.'
        };

        next();
      }
      else if (results.length < 1) {
        db.query(`INSERT INTO users (id, nama, email, alamat, role, password, status, create_at, update_at) VALUES ('${idAdmin}', '${nama}', '${email}', '${alamat}', 'admin', '${password}', '${status}', '${timestamp('HH:mm:YYYY-MM-DD')}', '${timestamp('HH:mm:YYYY-MM-DD')}')`, err => {
          if (err) throw err;

          db.commit(err => {
            if (err) return db.rollback(() => { throw err; });

            next();
          });
        });
      }
    });
  });
}

function updateAdmin(req, res, next) {
  const idAdmin = req.params.id;
  const { nama, email, alamat, password, status } = req.body;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT * FROM users`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });

      const account = results.filter(acc => acc.email === email && acc.id !== idAdmin); // Mencari email yang sama selain dari id yang dipilih

      // console.log(account);

      if (account.length > 0) {
        req.session.messages = {
          type: 'danger',
          intro: 'Duplikasi Email',
          message: 'Alamat email yang ada masukan sudah terdaftar di database. Silahkan pastikan, anda belum melakukankan pendaftaran sebelumnya.'
        };

        next();
      }
      else if (account.length < 1) {
        const filterDataById = results.filter(user => user.id === idAdmin);

        // console.log(filterDataById);

        const reqData = {
          reqNama: nama === '' ? filterDataById[0].nama : nama,
          reqEmail: email === '' ? filterDataById[0].email : email,
          reqAlamat: alamat === '' ? filterDataById[0].alamat : alamat,
          reqPass: password === '' ? filterDataById[0].password : password,
          reqStat: status === '' ? filterDataById[0].status : status
        }

        // console.log(password);
        // console.log(reqData.reqStat);

        db.query(`UPDATE users SET nama='${reqData.reqNama}', email='${reqData.reqEmail}', alamat='${reqData.reqAlamat}', password='${reqData.reqPass}', status='${reqData.reqStat}', update_at='${timestamp('HH:mm:YYYY-MM-DD')}' WHERE id='${idAdmin}'`, err => {
          if (err) throw err;

          db.commit(err => {
            if (err) return db.rollback(() => { throw err; });

            next();
          });
        });
      }
    });
  });
}

function deleteAdmin(req, res, next) {
  const idAdmin = req.params.id;
  
  db.query(`DELETE FROM users WHERE id='${idAdmin}'`, err => {
    if (err) throw err;

    next();
  });
}

module.exports = {
  readAdmin,
  readTotalAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin
};