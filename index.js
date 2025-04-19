const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1:27017/authDemo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database is Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("THIS IS THE HOME PAGE");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hash });
  await user.save();
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validLogin = await bcrypt.compare(password, user.password);
  if (validLogin) {
    res.send("You've Successfully Logged In!!!");
  } else {
    res.send("INCORRECT! PLEASE TRY AGAIN");
  }
});

app.get("/secret", (req, res) => {
  res.send("THIS IS A SECRET PAGE! IT WON'T BE HERE IN THE FUTURE");
});

app.listen(3030, () => {
  console.log("LISTENING ON PORT 3030");
});
