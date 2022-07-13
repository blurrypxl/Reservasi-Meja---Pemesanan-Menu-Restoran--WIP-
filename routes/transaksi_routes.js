const router = require('express').Router();
const reservasiServices = require('../services/reservasi_service');
const transaksiServices = require('../services/transaksi_service');
const emailServices = require('../services/email_service');
const userChecker = require('../services/auth_service');

router.route('/admin/transaksi')
  .get(userChecker.checkAuth, (req, res) => {
    res.render('viewAdmin/pages/pageTransaksi');
  });

router.route('/admin/validasi-transaksi')
  .get(userChecker.checkAuth, transaksiServices.readBuktiTransaksi, (req, res) => {
    res.render('viewAdmin/pages/pageValidasiTransaksi', { user: req.session.user, dataDetailReservasi: res.locals.detailReservasi });
  });

// TODO: Testing route ini lebih lanjut!
router.route('/admin/validasi-transaksi/:id')
  .put(userChecker.checkAuth, reservasiServices.updateStatusReservasi, reservasiServices.readDetailReservasi, (req, res, next) => {
    let reqSubject;
    let reqMessage;

    const filterDetailReservasi = res.locals.dataReservasi.filter(reservasi => reservasi.id_transfer.toString() === req.params.id.toString());

    // console.log(filterDetailReservasi);
    // console.log(filterPesanan);

    if (res.locals.validator === 'valid') {
      reqSubject = 'BUKTI VALIDASI RESERVASI';
      reqMessage = `
      <h2> BUKTI RESERVASI </h2>
      <table style='border: 1px solid black;'>
        <tr style='border: 1px solid black;'>
          <th style='border: 1px solid black;' style='border: 1px solid black;'>ID Reservasi</th>
          <th style='border: 1px solid black;' style='border: 1px solid black;'>Nama Pelanggan</th>
          <th style='border: 1px solid black;' style='border: 1px solid black;'>Tanggal Reservasi</th>
          <th style='border: 1px solid black;' style='border: 1px solid black;'>Status Reservasi</th>
        </tr>
        <tr style='border: 1px solid black;'>
          <td style='border: 1px solid black;'>${filterDetailReservasi[0].id_reservasi}</td>
          <td style='border: 1px solid black;'>${filterDetailReservasi[0].nama_pelanggan}</td>
          <td style='border: 1px solid black;'>${filterDetailReservasi[0].untuk_tanggal}</td>
          <td style='border: 1px solid black;'>${filterDetailReservasi[0].status_reservasi}</td>
        </tr>
      </table>`;
    }
    else if (res.locals.validator === 'tidak-valid') {
      reqSubject = 'BUKTI TRANSFER TIDAK VALID';
      reqMessage = `
      <h3> Silahkan masukan bukti transfer yang valid ke dalam link dibawah ini. </h3>
      <a href='http://localhost:3000/update-bukti-transaksi/${filterDetailReservasi[0].id_pelanggan}'>FORM BUKTI TRANSFER</a>
      `;
    }

    res.locals.configMessage = {
      email_pelanggan: res.locals.email,
      priority: 'high',
      subject: reqSubject,
      message: reqMessage
    }

    next();
  }, emailServices.createMessageConfig, (req, res, next) => {
    console.log(res.locals.validator);

    res.locals.sendMail;

    if (res.locals.validator === 'valid') {
      next();
    }
    else if (res.locals.validator === 'tidak-valid') {
      res.redirect('/admin/validasi-transaksi');
    }    
  }, transaksiServices.createTransaksi, (req, res) => { 
    res.redirect('/admin/validasi-transaksi');
  });

router.route('/admin/download/bukti-transaksi/:id')
  .post(userChecker.checkAuth, transaksiServices.downloadBuktiTransaksi, (req, res) => {
    res.redirect('/admin/download/bukti-transaksi/' + res.locals.idBukti);
  })
  .get(userChecker.checkAuth, (req, res) => {
    res.locals.download = req.session.download;
    
    delete req.session.download;

    res.download(res.locals.download);
  });

module.exports = router;