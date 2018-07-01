// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var setupPassport = require('./config/passport.js');
    
    

    

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(cookieParser());
app.use(session({ secret: '847210945frbi09y', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash('error');
    next();
});

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("public"));

setupPassport(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

// Import routes and give the server access to them.
var routes = require("./controllers/career-day-controllers.js");

app.use("/", routes);

