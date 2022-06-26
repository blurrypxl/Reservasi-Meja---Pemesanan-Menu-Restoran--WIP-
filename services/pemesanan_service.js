const db = require('../server');
// const { v4: uuidv4 } = require('uuid');
const gUniqId = require('generate-unique-id');
const timestamp = require('time-stamp');

function createReservasiDanPesanan(req, res, next) {
  const { nama, email, id_meja, untuk_tgl, arr_pesanan } = req.body;
  const idPelanggan = "PLG-"+gUniqId({ length: 7 });

  db.beginTransaction(err => {
    if (err) throw err;

    // Menyimpan Data Pelanggan
    db.query(`INSERT INTO pelanggan (id, id_meja, nama_pelanggan, create_at, update_at) VALUES ('${idPelanggan}', '${id_meja}', '${nama}', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
      if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

      db.commit(err => {
        if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

        console.log("Data Pelanggan berhasil disimpan"); //Logs simpan data success
      });
    });

    // Menyimpan Data Pesanan
    JSON.parse(arr_pesanan).forEach(itemP => {
      db.query(`INSERT INTO pesanan (id, id_pelanggan, id_menu, qty, total_harga, create_at) VALUES ('${"PSN-"+gUniqId({ length: 7 })}', '${idPelanggan}', '${itemP.idMenu}', '${itemP.qty}', '${itemP.total}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
        if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

        db.commit(err => {
          if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

          console.log("Data Pesanan dengan ID: " + itemP.idMenu + " berhasil disimpan"); //Logs simpan data success
        });
      });
    });

    // Menyimpan Data Reservasi
    db.query(`INSERT INTO reservasi (id, id_pelanggan, email, untuk_tanggal, status_reservasi, create_at, update_at) VALUES ('${"RSV-"+gUniqId({ length: 7 })}', '${idPelanggan}', '${email}', '${untuk_tgl}', 'Menunggu Pembayaran', '${timestamp("HH:mm:YYYY-MM-DD")}', '${timestamp("HH:mm:YYYY-MM-DD")}')`, err => {
      if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

      db.commit(err => {
        if (err) return db.rollback(() => { throw err }); //Jika terjadi Error, Maka akan menarik kembali perubahan yang terjadi

        console.log("Data Reservasi berhasil disimpan"); //Logs simpan data success

        res.locals.id = idPelanggan;

        next();
      });
    });
  });
}

module.exports = {
  createReservasiDanPesanan,
};
