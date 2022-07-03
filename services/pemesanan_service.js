const db = require('../server');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');

function createReservasiDanPesanan(req, res, next) {
  const { nama, email, id_meja, untuk_tgl, arr_pesanan } = req.body;
  const idPelanggan = "PLG-" + gUniqId({ length: 7 });
  res.locals.id = idPelanggan;
  const reqMenu = JSON.parse(arr_pesanan);
  const resMenu = [];

  db.beginTransaction(err => {
    if (err) throw err;

    db.query(`SELECT id, qty FROM menu`, (err, dataMenu) => {
      if (err) return db.rollback(() => { throw err; });

      // Memeriksa quantity data menu
      for (let i = 0; i < dataMenu.length; i++) {
        for (let y = 0; y < reqMenu.length; y++) {
          if (reqMenu[y].idMenu === dataMenu[i].id) {
            if (reqMenu[y].qty > dataMenu[i].qty) {
              req.session.messages = {
                type: 'warning',
                intro: 'Quantity Menu Tidak Cukup',
                message: 'Silahkan kurangi quantity atau pilih menu lain.'
              };

              return next();
            }

            resMenu.push({
              idMenu: dataMenu[i].id,
              qtyMenu: dataMenu[i].qty,
            });
          }
        }
      }

      console.log(resMenu);

      // Menyimpan Data Pelanggan
      db.query(`INSERT INTO pelanggan (id, id_meja, nama_pelanggan, create_at, update_at) VALUES ('${idPelanggan}', '${id_meja}', '${nama}', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
        if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

        db.commit(err => {
          if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

          console.log("Data Pelanggan berhasil disimpan"); //Logs simpan data success
        });
      });

      // Menyimpan Data Pesanan
      for (let i = 0; i < reqMenu.length; i++) {
        db.query(`UPDATE menu SET qty='${resMenu[i].qtyMenu -= reqMenu[i].qty}' WHERE id='${reqMenu[i].idMenu}'`, err => {
          if (err) return db.rollback(() => { throw err; });

          console.log('Update Quantity Berhasil');

          db.query(`INSERT INTO pesanan (id, id_pelanggan, id_menu, qty, total_harga, create_at) VALUES ('${"PSN-" + gUniqId({ length: 7 })}', '${idPelanggan}', '${reqMenu[i].idMenu}', '${reqMenu[i].qty}', '${reqMenu[i].total}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
            if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

            db.commit(err => {
              if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

              console.log("Data Pesanan dengan ID: " + reqMenu[i].idMenu + " berhasil disimpan"); //Logs simpan data success
            });
          });
        });
      }

      // Menyimpan Data Reservasi
      db.query(`INSERT INTO reservasi (id, id_pelanggan, email, untuk_tanggal, status_reservasi, create_at, update_at) VALUES ('${"RSV-" + gUniqId({ length: 7 })}', '${idPelanggan}', '${email}', '${untuk_tgl}', 'Menunggu Pembayaran', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
        if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

        db.commit(err => {
          if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

          console.log("Data Reservasi berhasil disimpan"); //Logs simpan data success

          delete req.session.validasiReservasi;

          next();
        });
      });
    });
  });
}

module.exports = {
  createReservasiDanPesanan,
};
