const db = require("../server");
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');
const uploadServices = require('../services/uploads_services');

function readMenu(req, res, next) {
  db.query("SELECT * FROM menu ORDER BY id ASC", (err, results) => {
    if (err) throw err;

    res.locals.dataMenu = results;

    next();
  });
}

function readTotalMenu(req, res, next) {
  db.query(`SELECT COUNT(id) AS total FROM menu WHERE status='tersedia'`, (err, results) => {
    if (err) throw err;

    res.locals.totalMenu = results;

    next();
  });
}

function createMenu(req, res, next) {
  if (req.file === undefined) {
    // console.log('request file is ' + req.file);
    next();
  }
  else if (req.file !== undefined) {
    const { nama_menu, jenis_menu, harga, qty, status } = req.body; // Destructing Assignment (DA)
    const createAt = timestamp('HH:mm:YYYY-MM-DD');
    const idMenu = 'MNU-' + gUniqId({ length: 7 });
    const idUser = req.session.idUsr;
    const fileGambarMenu = req.file.filename;

    // console.log(fileGambarMenu);

    db.query(`INSERT INTO menu (id, id_user, nama_menu, jenis_menu, harga, gambar_menu, qty, status, create_at, update_at) VALUES ('${idMenu}', '${idUser}', '${nama_menu}', '${jenis_menu}', '${harga}', '${fileGambarMenu}', '${qty}', '${status}', '${createAt}', '${createAt}')`, err => {
      if (err) throw err;

      next();
    });
  }
}

function updateMenu(req, res, next) {
  const id = req.params.id;
  const { nama, jenis_menu, qty, harga, status } = req.body;
  const updateAt = timestamp('HH:mm:YYYY-MM-DD');
  const idUser = req.session.idUsr;

  // console.log(req.body);
  // console.log(req.file);

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT * FROM menu WHERE id='${id}'`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });

      // console.log(results);

      const reqData = {
        reqNamaMenu: nama === '' ? results[0].nama_menu : nama,
        reqJenisMenu: jenis_menu === '' ? results[0].jenis_menu : jenis_menu,
        reqQty: qty === '' ? results[0].qty : qty,
        reqHarga: harga === '' ? results[0].harga : harga,
        reqGambar: req.file === undefined ? results[0].gambar_menu : req.file.filename,
        reqStatus: status === '' ? results[0].status : status
      };

      // console.log(reqData);

      if (req.file !== undefined) {
        const pathOldImg = req.file.destination + '/' + results[0].gambar_menu;

        // console.log(pathOldImg);

        uploadServices.removeImageFromDisk(pathOldImg); // Hapus Gambar dari Folder Images pada disk penyimpanan
      }

      db.query(`UPDATE menu SET id_user='${idUser}', nama_menu='${reqData.reqNamaMenu}', jenis_menu='${reqData.reqJenisMenu}', harga='${reqData.reqHarga}', gambar_menu='${reqData.reqGambar}', qty='${reqData.reqQty}', status='${reqData.reqStatus}', update_at='${updateAt}' WHERE id='${id}'`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          next();
        });
      });
    });
  });
}

function deleteMenu(req, res, next) {
  const id = req.params.id;

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT gambar_menu FROM menu WHERE id='${id}'`, (err, results) => {
      if (err) return db.rollback(() => { throw err; });

      const pathOldImg = './public/uploads/menu/'+results[0].gambar_menu;

      uploadServices.removeImageFromDisk(pathOldImg); // Hapus gambar dari disk penyimpanan

      db.query(`DELETE FROM menu WHERE id='${id}'`, err => {
        if (err) return db.rollback(() => { throw err; });

        db.commit(err => {
          if (err) return db.rollback(() => { throw err; });

          next();
        });
      });
    });
  });
}

module.exports = {
  readMenu,
  readTotalMenu,
  createMenu,
  updateMenu,
  deleteMenu
};
