var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports = function(app){
    app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    //app.use(session({ secret: 'password', resave: true, saveUninitialized: false}));   

};
