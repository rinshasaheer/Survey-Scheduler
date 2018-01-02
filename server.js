const express = require("express");
const path = require("path");
const company = require("./routes/company");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const config = require("./config/database");
const http = require("http");

mongoose.connect(config.database);
mongoose.connection.on('connected',()=>{
    console.log("database connected");
});
mongoose.connection.on('error',(err)=>{
    console.log("database Error" + err);
});


const app = express();
const port = 3001;

app.use(cors());


app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,"public")));
app.use('/company',company);


app.get('/', (req,res)=>{
    res.send("Invalid end point");
});


app.listen(port,() => {
    console.log("Server Started On Port " + port);

});