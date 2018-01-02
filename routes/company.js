const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');
const config = require('./../config/database.js');
const Company = require("../model/company"); 
var http = require('http');

'use strict';
 
// ---------------------------------Start-------------------------------------------
// Function      : cron job
// Params        : id
// Returns       : 
// Author        : Jooshifa
// Date          : 2-01-2018
// Last Modified : 2-01-2018, Jooshifa Desc
// Desc          : to change status of company when its expired
var CronJob = require('cron').CronJob;
new CronJob('*/1 * * * * *', function() {
  console.log('You will see this message every second');


    Company.find({ $or:[ {cmp_status : 'Not Verified'},{cmp_status : 'Trail'} ]}, function(err, TrialCompanys) {
        
        TrialCompanys.forEach(function(trailComp) {
            var expiredDate = new Date( trailComp.reg_datetime); 
            expiredDate.setDate( expiredDate.getDate() +  config.trail_period );
                if(expiredDate >= Date.now()){
                    console.log(trailComp.id)
                        var extServerOptions = {
                            host: 'localhost',
                            port: '3000',
                            path: '/company/expiredsocket/'+trailComp.id,
                            method: 'GET',
                            
                        };
                       
                        function get() {
                            http.request(extServerOptions, function (res) {
                                res.setEncoding('utf8');

                        
                            }).end();
                        };
                        
                        get();
    
                        Company.findOneAndUpdate({_id : trailComp.id }, 
                                { $set: { cmp_status: "Expired" }}, 
                                { new: true }, 
                                function(err, doc) {
                                        if(err){
                                            console.log("Error in editing")
                                        }
                                        else{
                                            console.log("Success")
                                        }
                                
                                });
                        
                }
        })
    });
      }, null, true, 'America/Los_Angeles');
// ----------------------------------End-------------------------------------------
module.exports = router;