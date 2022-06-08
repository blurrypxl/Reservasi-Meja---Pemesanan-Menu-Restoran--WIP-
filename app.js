const express = require("express");
const devenv = require("./devEnvConfig");
const methodOverride = require("method-override");
// const session = require("express-session");
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
// app.use(session({
//   secret: "hello-agent47",
//   resave: false,
//   name: "uniqueSessionID",
//   saveUninitialized: false
// }));
app.post("/auth-account", authService.checkAccount, authService.logIn); // Authentication Admin

// # Set view engine
app.set("view engine", "ejs");

// Set dashboard view page
// app.get('/admin', (req, res) => {
//   req.session.loggedIn === true ?
//     res.render("viewAdmin/pages/dashboard") : res.redirect("/admin/login");
// });

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

app.listen(devenv.port, () => {
  console.log(`Server running at port ${devenv.port}`);
});
