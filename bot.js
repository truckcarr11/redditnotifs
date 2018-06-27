const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const Snoowrap = require('snoowrap');

const smtpTransport = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_EMAIL_PASSWORD
    }
});

const r = new Snoowrap({
    userAgent: process.env.REDDIT_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});


setInterval(function(){
    r.getHot().then(posts => {
        posts.forEach(post => {
            var canSend = true;
            fs.readFileSync('sentPosts.txt').toString().split('\n').forEach(function(line){ 
                if(line==post.permalink){
                    canSend = false;
                }
            });
            if(canSend){
                if(post.subreddit.display_name=='LeagueOfLegends'){
                    sendText(post.permalink);
                }
                var currentTime = new Date().getTime();
                var postedTime = new Date(post.created_utc*1000);
                if((currentTime-postedTime)<10800000){
                    sendText(post.permalink);
                }
            }   
        });
    });
}, 600000);

setInterval(function(){
    fs.truncate('sentPosts.txt', 0, function(){
        console.log('Cleared file.');
    });
}, 18000000);

function sendText(url){
    var mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        text: "Check out this post. " + "http://reddit.com"+ url,
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent.");
        }
    });
    fs.appendFile('sentPosts.txt',url + "\n", function(){
        console.log('Wrote to file.');
    });
}