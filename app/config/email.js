//module
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");


const transporter = nodemailer.createTransport({
  host: process.env.EmailHost,
  secureConnection: false,
  port: 465,
  auth: {
    user: process.env.EmailUser,
   pass: process.env.EmailPass,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

const options = {
  viewEngine: {
    layoutsDir: path.resolve("views/emails"),
    defaultLayout: "_main",
    extname: ".hbs",
  },
  extName: ".hbs",
  viewPath: path.resolve("views/emails"),
};

transporter.use("compile", hbs(options));

module.exports = transporter;