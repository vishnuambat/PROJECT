var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/userModel");
 
 
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(require("express-session")({
    secret: "node js mongodb",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

app.get("/", function (req, res) {
    res.render('register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: ''     
  })
});
 

app.get("/home", isLoggedIn, function (req, res) {
    res.render("home");
});
 

app.get("/register", function (req, res) {
    res.render('register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: ''     
  })
});
 

app.post("/register", function (req, res) {
    var email = req.body.email
    var password = req.body.password
    User.register(new User({ email: email }),
            password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
 
        passport.authenticate("local")(
            req, res, function () {
            req.flash('success', 'You have logged in')
            res.render("home");
        });
    });
});
 

app.get("/login", function (req, res) {
     res.render('login', {
        title: 'Login',
        email: '',
        password: ''      
    })
});
 

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function (req, res) {
});
 

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
 
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
