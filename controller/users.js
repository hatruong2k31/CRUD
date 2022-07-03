var express = require("express");
var app = express();

//show json users list
app.get("/", function (req, res) {
  req.getConnection(function (error, conn) {
    conn.query(
      "SELECT * FROM user ORDER BY Id ASC",
      function (error, results, fields) {
        if (error) throw error;
        return res.send({
          message: "Users List",
          data: results,
        });
      }
    );
  });
});

//show json user by cardId
app.get("/:cardId", function (req, res) {
  req.getConnection(function (error, conn) {
    conn.query(
      "SELECT * FROM user WHERE cardId=?",
      req.params.cardId,
      function (error, results, fields) {
        if (error) throw error;

        if (!req.params.cardId) {
          res.status(400).send({
            message: "user not found with cardId = " + req.params.cardId,
          });
        } else {
          return res.send({
            message: "user with cardId = " + req.params.cardId,
            data: results[0],
          });
        }
      }
    );
  });
});

// update balance
app.put("/update/:cardId", function (req, res) {
  req.getConnection(function (error, conn) {
    conn.query(
      "UPDATE user SET balance = balance - 10000 WHERE cardId =",
      req.params.cardId,
      user,
      function (error, results) {
        if (error) throw error;

        if (!req.params.cardId) {
          return res.status(400).send({
            message: "Please provide Card Id for update balance",
          });
        } else {
          return res.send({
            message: "Balance has been updated successfully.",
            data: results,
          });
        }
      }
    );
  });
});

module.exports = app;
