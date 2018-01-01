

const express = require('express');
const app = express();
const JwtStrategy = require('passport-jwt').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./../model/user');
const config = require('./database');
const passport = require('passport');
var configAuth = require('./auth');
// var session = require('express-session');

module.exports = function(passport){
  let opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    // console.log("here");
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err){
        return done(err, false);
      }

      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// -----------------------------------FB------------------------------------------------------------------------------------------------------------------------------------------
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: configAuth.facebookAuth.profileFields
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
        // if(!req.user){
            // User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    user.facebook.id    = profile.id;
                    user.facebook.token = token;
                    user.facebook.name  = profile.displayName;
                    user.facebook.email = profile.emails[0].value;
                    user.verified = "true";
                    user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                    });
                    // if (!user.facebook.token) {
                    //     user.facebook.token = token;
                    //     user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    //     user.facebook.email = profile.emails[0].value;

                    //     user.save(function(err) {
                    //         if (err)
                    //             throw err;
                    //         return done(null, user);
                    //     });
                    // }
                    // return done(null, user); 
                } else {
                          
                          var newUser            = new User();
                          newUser.facebook.id    = profile.id; // set the users facebook id                   
                          newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                          newUser.facebook.name  = profile.name.givenName; // look at the passport user profile to see how names are returned
                          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                          newUser.name = profile.name.givenName;
                          newUser.email = profile.emails[0].value;
                          newUser.verified = "true";
                          newUser.save(function(err) {
                              if (err)
                                  throw err;
                                   return done(null, newUser);
                          });
                      }
      
                  });
        // }else {
            // user already exists and is logged in, we have to link accounts
            // var user            = req.user; // pull the user out of the session

            // user.facebook.id    = profile.id;
            // user.facebook.token = token;
            // user.facebook.name  = profile.name.givenName;
            // user.facebook.email = profile.emails[0].value;
            // user.name = profile.name.givenName;
            // user.email = profile.emails[0].value;
            // user.verified = "true";
            // user.save(function(err) {
            //     if (err)
            //         throw err;
            //     return done(null, user);
            // });

        // }
    });
      
  }));
  
// ------------------------------End of fb strategy-------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------google startegy----------------------------------------------------------------------------------------------

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret:configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(req, token, refreshToken, profile, done) {
        // console.log(profile);
        process.nextTick(function() {
            // if(!req.user){
                        // try to find the user based on their google id
                        User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                            if (err)
                                return done(err);
            
                            if (user) {
            
                                // if a user is found, log them in
                                user.google.id    = profile.id;
                                user.google.token = token;
                                user.google.name  = profile.displayName;
                                user.google.email = profile.emails[0].value;
                                user.verified = "true";
                                user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                                });
                                // return done(null, user);
                            } else {
                                // if the user isnt in our database, create a new user
                                var newUser          = new User();
            
                                // set all of the relevant information
                                newUser.google.id    = profile.id;
                                newUser.google.token = token;
                                newUser.google.name  = profile.displayName;
                                newUser.google.email = profile.emails[0].value; // pull the first email
                                newUser.name = profile.displayName;;
                                newUser.email = profile.emails[0].value;
                                newUser.verified = "true";
                                // save the user
                                newUser.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            }
                        });
                    });
            
    }
    ));
// ----------------------------------------------------------------------end of google strategy-----------------------------------------------------------------------------------------
}
