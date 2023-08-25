//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const md5 = require("md5");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  newUser
    .save()
    .then(() => {
      console.log("New user saved successfully! ✅");
      res.send(newArticle);
    })
    .catch((error) => res.send(error));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      } else {
        res.send("User not found");
      }
    })
    .catch((error) => res.send(error));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
