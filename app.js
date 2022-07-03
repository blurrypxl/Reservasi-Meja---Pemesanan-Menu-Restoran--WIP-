const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");

const pageMenuRouter = require("./routes/pageMenu_routes");
const mejaRouter = require("./routes/pageMeja_routes");
const reservasiRouter = require("./routes/reservasi_routes");
const pemesananRouter = require("./routes/pemesanan_routes");
const authService = require("./services/auth_service");
const dashboardRouter = require("./routes/dashboard_routes");
const usersRouter = require("./routes/admin_routes");

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

// # Set view engine
app.set("view engine", "ejs");

// # View Login File
app.get('/admin/login', (req, res) => {
  res.status(200).render("viewAdmin/pages/login");
});

// # Dashboard Admin
app.use(dashboardRouter);

// # Data Admin
app.use(usersRouter);

// # Data Menu
app.use(pageMenuRouter);

// # Data Meja
app.use(mejaRouter);

// # Reservasi
app.use(reservasiRouter);

// # Pemesanan
app.use(pemesananRouter);

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

app.listen(3000, () => {
  console.log(`Server running at port 3000`);
});
