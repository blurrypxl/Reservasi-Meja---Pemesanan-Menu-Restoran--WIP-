// const pdfkit = require('pdfkit');
const pdf = require('html-pdf');
const ejs = require('ejs');
const timestamp = require('time-stamp');

function createPdfTransaksi(req, res, next) {
  const data = {
    user: req.session.user,
    dataPesanan: res.locals.dataPesanan,
    dataTransaksi: res.locals.dataTransaksi
  };

  ejs.renderFile('views/templatePdf/pagePdfTransaksi.ejs', data, (err, str) => {
    if (err) throw err;

    pdf.create(str, { format: 'Letter' }).toStream((err, pdfStream) => {
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

    pdf.create(str, { format: 'Letter' }).toStream((err, pdfStream) => {
      if (err) throw err;

      pdfStream.on('end', () => res.end());

      pdfStream.pipe(res);
    });
  });
}

function createPdfInvoicePelanggan(req, res, next) {
  const data = {
    dataReservasi: res.locals.dataReservasi,
    dataPesanan: res.locals.dataPesanan,
    totalBayar: res.locals.total
  }

  ejs.renderFile('views/templatePdf/pagePdfInvoicePelanggan.ejs', data, (err, str) => {
    if (err) throw err;

    pdf.create(str, { format: 'A4' }).toStream((err, pdfStream) => {
      if (err) throw err;

      pdfStream.on('end', () => res.end());

      pdfStream.pipe(res);
    });
  });
}

function createPdfBuktiReservasi(req, res, next) {
  const filterDetailReservasi = res.locals.detailReservasi.filter(reservasi => reservasi.id_transfer == req.params.id);

  const filterPesanan = res.locals.dataPesanan.filter(pesanan => pesanan.id_pelanggan == filterDetailReservasi[0].id_pelanggan);

  ejs.renderFile('views/templateEmail/pageEmailBuktiReservasi.ejs', { user: req.session.user, detailReservasi: filterDetailReservasi, dataPesanan: filterPesanan }, (err, str) => {
    if (err) throw err;

    pdf.create(str, { format: 'Letter' }).toStream((err, pdfStream) => {
      if (err) throw err;
  
      pdfStream.on('end', () => res.end());

      pdfStream.pipe(res);
    });
  });
}

module.exports = {
  createPdfTransaksi,
  createPdfReservasi,
  createPdfInvoicePelanggan,
  createPdfBuktiReservasi,
};