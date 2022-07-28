const db = require("../server");
const timestamp = require("time-stamp");
const gUniqId = require('generate-unique-id');

function readMeja(req, res, next) {
  db.query("SELECT meja.id, meja.id_user, users.nama AS nama_user, users.role AS role_user, meja.nomor_meja, meja.max_person, meja.status, meja.create_at, meja.update_at FROM meja JOIN users ON meja.id_user=users.id ORDER BY nomor_meja ASC", (err, results) => {
    if (err) throw err;

    res.locals.dataMeja = results;

    next();
  });
}

function readTotalMeja(req, res, next) {
  db.query(`SELECT COUNT(*) AS total FROM meja`, (err, results) => {
    if (err) throw err;

    res.locals.totalMeja = results;

    // console.log(res.locals.totalMeja);
    // console.log(results);

    next();
  });
}

function createMeja(req, res, next) {
  const { nomor_meja, max_person, status } = req.body;
  const idMeja = "MJA-" + gUniqId({ length: 7 });
  const idUser = req.session.idUsr;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT * FROM meja`, (err, dataMeja) => {
      if (err) return db.rollback(() => { throw err; });

      // Validasi nomor meja
      const getNomorMeja = dataMeja.filter(meja => meja.nomor_meja === parseInt(nomor_meja));

      if (getNomorMeja.length > 0) {
        req.session.messages = {
          type: 'warning',
          intro: 'Duplikasi Nomor Meja.',
          message: 'Silahkan pilih nomor meja yang lain.'
        };

        return next();
      }

      // Validasi max person
      if (max_person < 2) {
        req.session.messages = {
          type: 'warning',
          intro: 'Max Person Tidak Valid.',
          message: 'Silahkan masukan minimal 2 orang'
        }

        return next();
      }

      // Simpan data meja kedalam database 
      db.query(`INSERT INTO meja (id, id_user, nomor_meja, max_person, status, create_at, update_at) VALUES ('${idMeja}', '${idUser}', '${nomor_meja}', '${max_person}', '${status}', '${timestamp('HH:mm:YYYY-MM-DD')}', '${timestamp('HH:mm:YYYY-MM-DD')}')`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          next();
        });
      });
    });
  });
}

function updateMeja(req, res, next) {
  const idMeja = req.params.id;
  const { nomor_meja, max_person, status } = req.body;
  const idUser = req.session.idUsr;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT * FROM meja`, (err, dataMeja) => {
      if (err) return db.rollback(() => { throw err; });

      // Validasi nomor meja
      const getNomorMeja = dataMeja.filter(meja => meja.nomor_meja === parseInt(nomor_meja) && meja.id !== idMeja);

      if (getNomorMeja.length > 0) {
        req.session.messages = {
          type: 'warning',
          intro: 'Duplikasi Nomor Meja.',
          message: 'Silahkan pilih nomor meja yang lain.'
        };

        return next();
      }

      // Validasi max person
      if (max_person < 2) {
        req.session.messages = {
          type: 'warning',
          intro: 'Max Person Tidak Valid.',
          message: 'Silahkan masukan minimal 2 orang'
        }

        return next();
      }

      const reqMeja = {
        reqNomorMeja: nomor_meja === '' ? dataMeja[0].nomor_meja : nomor_meja,
        reqMaxPerson: max_person === '' ? dataMeja[0].max_person : max_person,
        reqStatus: status === '' ? dataMeja[0].status : status
      }

      db.query(`UPDATE meja SET id_user='${idUser}', nomor_meja='${reqMeja.reqNomorMeja}', max_person='${reqMeja.reqMaxPerson}', status='${reqMeja.reqStatus}', update_at='${timestamp('DD:mm:YYYY-MM-DD')}' WHERE id='${idMeja}'`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          next();
        });
      });
    });
  });
}

// function deleteMeja(req, res, next) {
//   const id = parseInt(req.params.id);

//   db.query(`DELETE FROM meja WHERE id_meja='${id}'`, err => {
//     if (err) throw err;

//     next();
//   });
// }

module.exports = {
  readMeja,
  readTotalMeja,
  createMeja,
  updateMeja,
};
