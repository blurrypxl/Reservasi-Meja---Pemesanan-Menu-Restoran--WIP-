// const pdfkit = require('pdfkit');
const pdf = require('html-pdf');
const fs = require('fs');
const ejs = require('ejs');
const timestamp = require('time-stamp');
const path = require('path');

const doc = new pdfkit();

// Konfigurasi Dokumen
const filePath = 'docs/Testing.pdf';
doc.fontSize(12);
doc.addPage({ size: 'A4' });

function createPdfTransaksi(req, res, next) {
  const dataTransaksi = res.locals.dataTransaksi;
  const dataPesanan = res.locals.dataPesanan;
  let data = { user: req.session.user, dataPesanan: dataPesanan, dataTransaksi: dataTransaksi };

  ejs.renderFile(path.join(__dirname, '../views/viewAdmin/pages/pageTransaksi.ejs'), data, (err, dataRender) => {
    if (err) throw err;

    // doc.pipe(fs.createWriteStream(path.join(__dirname, '../docs/' + dataRender)));

    doc.file(Buffer.from(dataRender), { name: 'TransaksiDocs.pdf'});

    doc.end();

    // res.locals.downloadPDF = filePath;

    console.log('SUKSES');

    next();
  });
}

// function createPdfTransaksi(req, res, next) {
//   const data = {
//     user: req.session.user,
//     dataPesanan: res.locals.dataPesanan,
//     dataTransaksi: res.locals.dataTransaksi
//   };

//   ejs.renderFile('views/viewAdmin/pages/pageTransaksi.ejs', data, (err, str) => {
//     if (err) throw err;

//     pdf.create(str).toFile('transaksiPDF', (err, data) => {
//       if (err) throw err;

//       console.log('success!');

//       next();
//     });
//   });
// }

function createPdfReservasi(req, res, next) { }

module.exports = {
  createPdfTransaksi,
};