var express = require("express");
var app = express();

// Show Login form
app.get("/", function (req, res, next) {
  // render to views/user/add.ejs
  res.render("login/login", {
    title: "",
    admin: "",
    password: "",
  });
});

// Show Logout
app.get("/logout", function (req, res) {
  req.session.destroy();
  req.flash("success", "Login Again Here");
  res.redirect("/login");
});

// Authenticate admin
app.post("/authentication", function (req, res, next) {
  var admin = req.body.admin;
  var password = req.body.password;

  connection.query(
    "SELECT * FROM mydb WHERE admin = ? AND password = ?",
    [admin, password],
    function (err, rows, fields) {
      if (err) throw err;

      // if admin not found
      if (rows.length <= 0) {
        req.flash("error", "Please correct enter Admin and Password!");
        res.redirect("/login");
      } else {
        // if user found
        // render to views/home.js template file
        req.session.loggedin = true;
        req.session.name = name;
        res.redirect("/home");
      }
    }
  );
});

//Show home page if login succes
// app.get("/home", function (req, res, next) {
//   if (req.session.loggedin) {
//     res.render("home", {
//       title: "",
//     });
//   } else {
//     req.flash("success", "Please login first!");
//     res.redirect("/login");
//   }
// });

module.exports = app;
