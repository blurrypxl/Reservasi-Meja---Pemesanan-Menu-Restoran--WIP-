const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");

const pageMenuRouter = require("./routes/pageMenu_routes");
const mejaRouter = require("./routes/pageMeja_routes");
const reservasiRouter = require("./routes/reservasi_routes");
const authService = require("./services/auth_service");
const dashboardRouter = require("./routes/dashboard_routes");

const app = express();

// # Middleware's
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'DelapanAngka',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: null }
}));

// # Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages;
  delete res.locals.messages;
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

// # View Dashboard Admin
app.use(dashboardRouter);

// # View Data Menu
app.use(pageMenuRouter);

// # View Data Meja
app.use(mejaRouter);

// # View Reservasi
app.use(reservasiRouter);

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
