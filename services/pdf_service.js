// const pdfkit = require('pdfkit');
const pdf = require('html-pdf');
const ejs = require('ejs');

function createPdfTransaksi(req, res, next) {
  const data = {
    user: req.session.user,
    dataPesanan: res.locals.dataPesanan,
    dataTransaksi: res.locals.dataTransaksi
  };

  ejs.renderFile('views/templatePdf/pagePdfTransaksi.ejs', data, (err, str) => {
    if (err) throw err;

    pdf.create(str, { format: 'A4' }).toStream((err, pdfStream) => {
      if (err) throw err;

      pdfStream.on('end', () => {
        return res.end();
      });

      pdfStream.pipe(res);
    });
  });
}

function createPdfReservasi(req, res, next) {
  const data = {
    user: req.session.user,
    dataReservasi: res.locals.dataReservasi,
    dataPesanan: res.locals.dataPesanan
  }

  ejs.renderFile('views/templatePdf/pagePdfReservasi.ejs', data, (err, str) => {
    if (err) throw err;

    pdf.create(str, { format: 'A4' }).toStream((err, pdfStream) => {
      if (err) throw err;

      pdfStream.on('end', () => {
        return res.end();
      })

      pdfStream.pipe(res);
    });
  });
}

module.exports = {
  createPdfTransaksi,
  createPdfReservasi
};