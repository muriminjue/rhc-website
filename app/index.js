require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const PORT = process.env.PORT;

//files
const websites_pages = require("./routes/pages");
const admin_pages = require("./routes/admin");
const logger = require("./config/logger");
const initialisePassport = require("./config/passport");
const db = require("./models");

// app init
const app = express();

initialisePassport(passport);
//use json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//startic
app.use(express.static("public"));

//session
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1800000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// method overide
app.use(methodOverride("_method"));

// file upload
app.use(
  fileUpload({
    safeFileNames: /\\/g,
  })
);

app.use(async function (req, res, next) {
  let user = await db.Users.findByPk(req.session?.passport?.user, {
    attributes: { exclude: ["user_password"] },
  });
  res.locals = {
    user: user,
    hostUrl:  req.protocol + "://" + req.get("host")
  };
  next();
});

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//routes
app.use("/admin", admin_pages);
app.use("/", websites_pages);

//seqeulize sync
db.sequelize.sync({
  force: 0,
});

//run app
app.listen(PORT, async function () {
  logger.info("server started on port " + PORT);
  await db.sequelize.authenticate();
  logger.info("Database connected!");
});
