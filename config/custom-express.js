var express = require('express');
var session = require('express-session');
var consign = require('consign');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.set('views', './app/views');

var corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true
}

// app.use(express.static(path.join(__dirname, '../app/public')));
// app.use(express.static(path.join(__dirname, '../app/views')));

module.exports = function () {
    //teste
    // app.use('/', function (req, res) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // });
    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({ secret: "u7m62LtZfQddKJfBmB1SgdyMvfGW8XWl", resave: false, saveUninitialized: false }));

    app.use(express.static(path.join(__dirname, '../bin/front')));
    app.use('/assets', express.static(path.join(__dirname, '../bin/assets')));

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Method', 'PUT, POST, DELETE, GET');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
        next();
    });

    consign()
        .include('controllers')
        .into(app);

    return app;
}