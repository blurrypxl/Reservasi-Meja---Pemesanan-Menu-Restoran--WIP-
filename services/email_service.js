const nodemailer = require('nodemailer');
// const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.PASS_EMAIL
  }
});

function createMessageConfig(req, res, next) {
  const reqConfig = res.locals.configMessage;

  const filterDetailReservasi = res.locals.detailReservasi.filter(reservasi => reservasi.id_transfer == req.params.id);

  const filterPesanan = res.locals.dataPesanan.filter(pesanan => pesanan.id_pelanggan == filterDetailReservasi[0].id_pelanggan);

  let cetakBuktiPdf = '';

  if (reqConfig.validator === 'valid') cetakBuktiPdf = `<a href="http://localhost:3000/cetak-bukti-reservasi/${filterDetailReservasi[0].id_transfer}" class="btn btn-primary">CETAK BUKTI RESERVASI</a>`;

  console.log(filterDetailReservasi);
  console.log(filterPesanan);

  ejs.renderFile(reqConfig.message, { user: req.session.user, detailReservasi: filterDetailReservasi, dataPesanan: filterPesanan }, (err, data) => {
    if (err) throw err;

    const messagesConfig = {
      from: process.env.EMAIL_ADMIN,
      to: reqConfig.email_pelanggan,
      priority: reqConfig.priority,
      subject: reqConfig.subject,
      html: cetakBuktiPdf + data
    }
  
    res.locals.sendMail = transporter.sendMail(messagesConfig);
  
    next();
  });
}

function createBuktiReservasi(req, res, next) {
  const emailPelanggan = res.locals.email;

  console.log(emailPelanggan);

  const messagesConf = {
    from: process.env.EMAIL_ADMIN,
    to: emailPelanggan,
    priority: 'high',
    subject: 'BUKTI VALIDASI RESERVASI',
    html: '<p>TEST SEND EMAIL</p>'
  };

  res.locals.sendMail = transporter.sendMail(messagesConf);

  next();
}

function createNotifikasiRevisi(req, res, next) {
  const emailPelanggan = res.locals.email;

  console.log(emailPelanggan);

  const messagesConf = {
    from: process.env.EMAIL_ADMIN,
    to: emailPelanggan,
    priority: 'high',
    subject: 'BUKTI TRANSFER TIDAK VALID!',
    html: '<p>Silahkan masukan kembali bukti transfer, dengan mengakses link berikut: </p>'
  };

  res.locals.sendMail = transporter.sendMail(messagesConf);

  next();
}

function createNotifikasi(req, res, next) {}

module.exports = {
  createMessageConfig
};