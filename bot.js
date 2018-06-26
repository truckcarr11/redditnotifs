var express = require("express");
var http = require('http');
var app = express();
require('dotenv').config();
var nodemailer = require("nodemailer");
const Snoowrap = require('snoowrap');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "tylerccarr1111@gmail.com",
        pass: "warcraft24"
    }
});

var mailOptions = {
    from: "tylerccarr1111@gmail.com",
    to: "9853289149@messaging.sprintpcs.com",
    text: "Hello world ✔",
}

const r = new Snoowrap({
    userAgent: 'Subreddit_Exists_Bot',
    clientId: 'WNcjGRoGdXtMMQ',
    clientSecret: 've_i33azVVX-thCE2OGx1YP-rd4',
    username: 'Subreddit_Exists_Bot',
    password: 'doesnotexist'
});


setInterval(function(){
    r.getHot().then(posts => {
        posts.forEach(post => {
           if(post.subreddit.display_name=='LeagueOfLegends'){
            sendText(post.permalink);
           }
           var currentTime = new Date().getTime();
           var postedTime = new Date(post.created_utc*1000);
           if((currentTime-postedTime)<10800000){
            sendText(post.permalink);
           }
        });
    });
}, 600000);

function sendText(url){
    var mailOptions = {
        from: "tylerccarr1111@gmail.com",
        to: "9853289149@messaging.sprintpcs.com",
        text: "Check out this post. " + "http://reddit.com"+ url,
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent.");
        }
    });
}

setInterval(function() {
    http.get("http://redditnotifs.herokuapp.com");
}, 300000);
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on port: ${ PORT }`);
});