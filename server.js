var express = require('express');
var app = express();

require('./config/app')(app);
require('./config/authentication')(app);
require('./config/database');
var User = require('./models/users');

app.post('/api/signup', function(req, res){
    var msg = "";
    User.findOne({'username': req.body.username}, function(err, Userb){
        if(err){ console.log(err); }
        if(Userb){
            msg = "user already exists";
            res.send({success:false, msg: msg, userID:null});
        }
        else{
            var newUser = new User();
            newUser.email = req.body.email;
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.save(function(err){
                if(err){ 
                    console.log(err);
                    msg = err;
                } else {
                msg = "success!";
                res.send({success: true, msg: msg, userID: newUser._id, username: req.body.username});
                }
            });
        }
    });
});

app.post('/api/login',  function(req,res){
    var msg = "";
    console.log('post login');
    User.findOne({'username': req.body.username}, function(err,user){
        if(err) { 
            console.log(err);
            msg = err;
            res.send({success:false, msg: msg, userID: null, username: req.body.username});
        }
        else if (!user){
            msg = "user does not exist";
            res.send({success:false, msg: msg, userID: null, username: req.body.username});
        }
        else if (!user.validPassword(req.body.password)){
            msg = "incorrect password";
            res.send({success:false, msg: msg, userID: null, username:req.body.username});
        }
        else{
            console.log("success");
            res.send({success:true, msg: "login success!", userID: user._id, username: req.body.username});
        }
    });
});

var http = require('http');
var server = http.createServer(app);
server.listen(31000, function(){
    console.log("listening on port 31000");
});
