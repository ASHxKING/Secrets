require("dotenv").config();
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const saltRounds = 9;
// const encrypt = require("mongoose-encryption");

const app = express();

//MONGOOSE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

// MONGOOSE SCHEMA
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

////////////////////////////////////////// encryption ////////////////////////////////////////////////


// UserSchema.plugin(encrypt, { secret: process.env.SECRETS, encryptedFields: ["password"] });

// MONGOOSE MODEL
const USER = mongoose.model("user", UserSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////////////////////  GET ROUTES  ///////////////////////////////////////////////////////////

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

///////////////////////////////////////////////////////////////  POST ROUTES  ///////////////////////////////////////////////////////////

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new USER({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(function () {
        res.render("secrets");
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  
  // .then(()=>{
  //     res.render("secrets");
  // })
  // .catch((err)=>{
  //     console.log(err);
  // })
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  USER.findOne({ email: username })
    .then((founduser) => {
      bcrypt.compare(password, founduser.password , function(err, result) {
        if(result == true){
          res.render("secrets");
        }
      })
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
