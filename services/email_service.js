const nodemailer = require('nodemailer');
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

  const messagesConfig = {
    from: process.env.EMAIL_ADMIN,
    to: reqConfig.email_pelanggan,
    priority: reqConfig.priority,
    subject: reqConfig.subject,
    html: reqConfig.message
  }

  res.locals.sendMail = transporter.sendMail(messagesConfig);

  next();
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