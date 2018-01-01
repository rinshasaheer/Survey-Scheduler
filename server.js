const express = require("express");
const app = express();
const port = 3000;

const http = require("http");
const socketIo = require("socket.io");

const server = http.Server(app);
const io = socketIo(server);

const path = require("path");
const admin = require("./routes/admin");
//const products = require("./routes/products")(io);

const bodyParser = require("body-parser");
const passport = require('passport');
var session = require('express-session');
const cors = require('cors');
const mongoose = require("mongoose");
const config = require("./config/database");


mongoose.connect(config.database);
mongoose.Promise = global.Promise;
mongoose.connection.on('connected',()=>{
    console.log("database connected");
});
mongoose.connection.on('error',(err)=>{
    console.log("database Error" + err);
});

//[mfIsServerPagination]="true"

app.use(cors());
app.use(bodyParser.json());

//app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: true } }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname,"public")));

app.use('/admin',admin);
// app.use('/products',products);
// app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'}));
// app.get('/auth/facebook/callback',passport.authenticate('facebook'),
// // function(req, res) {
//     return res.redirect("/socialmedia/" + req.user._id);
//         });
// app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
// {successRedirect: '/registration', failureRedirect: '/login' } in login
// app.get('/auth/google/callback', passport.authenticate('google'),
//  function(req, res) {
//     return res.redirect("/socialmedia/" + req.user._id);
//         });

app.use('*',(req, res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});
app.get('/', (req,res)=>{
    res.send("Invalid end point");
});


server.listen(port,() => {
    console.log("Server Started On Port " + port);

});