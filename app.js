const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");
require('dotenv').config();

const menuRouter = require("./routes/pageMenu_routes");
const mejaRouter = require("./routes/pageMeja_routes");
const reservasiRouter = require("./routes/reservasi_routes");
const pemesananRouter = require("./routes/pemesanan_routes");
const authService = require("./services/auth_service");
const dashboardRouter = require("./routes/dashboard_routes");
const usersRouter = require("./routes/admin_routes");
const transaksiRouter = require('./routes/transaksi_routes');
const pdfRouter = require('./routes/pdf_routes');

const app = express();

// # Middleware's
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'DelapanAngka',
  resave: false,
  saveUninitialized: false
}));

// # Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages;

  delete req.session.messages;
  
  next();
});

// # Authentication Admin
app.post("/auth-account", authService.checkAccount, authService.logIn);

app.post("/admin/logout", authService.logOut);

// # Set view engine
app.set("view engine", "ejs");

// # View Login File
app.get('/admin/login', (req, res) => {
  res.render("viewAdmin/pages/login");
});

// # Dashboard Admin
app.use(dashboardRouter);

// # Data Admin
app.use(usersRouter);

// # Data Menu
app.use(menuRouter);

// # Data Meja
app.use(mejaRouter);

// # Reservasi
app.use(reservasiRouter);

// # Pemesanan
app.use(pemesananRouter);

// # Transaksi
app.use(transaksiRouter);

// # PDF
app.use(pdfRouter);

// # 404 Not Found Handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found :(");

  err.status = 404;
  
  next(err);
});

// # Error's Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at port ${process.env.SERVER_PORT}`);
});
