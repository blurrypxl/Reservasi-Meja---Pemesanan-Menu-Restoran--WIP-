const express = require("express");
const devenv = require("./devEnvConfig");
const methodOverride = require("method-override");
const session = require("express-session");
const bodyParser = require("body-parser");
const pageMenuRouter = require("./routes/pageMenu_routes");
const mejaRouter = require("./routes/pageMeja_routes");
const authService = require("./services/auth_service");
const dashboardRouter = require("./routes/dashboard_routes");

const app = express();

// # Middleware's
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "hello-agent47",
  resave: false,
  name: "uniqueSessionID",
  saveUninitialized: false
}));
app.post("/auth-account", authService.checkAccount, authService.logIn); // Authentication

// # Set view engine
app.set("view engine", "ejs");

// Set default view page
app.get('/', (req, res) => {
  req.session.loggedIn == true ?
    res.render("pages/index") : res.redirect("/login");
});

// # View Login File
app.get('/login', (req, res) => {
  res.status(200).render("pages/login");
});

// # View Dashboard Admin
app.use(dashboardRouter);

// # View Data Menu
app.use(pageMenuRouter);

// # View Data Meja
app.use(mejaRouter);

app.listen(devenv.port, () => {
  console.log(`Server running at port ${devenv.port}`);
});
