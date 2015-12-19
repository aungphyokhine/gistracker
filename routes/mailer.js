var nodemailer = require("nodemailer");
var express = require('express');
var router = express.Router();

//{"username":"user02","password":"123"}
router.post('/send', function(req, res, next) {
var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "thargyee@gmail.com", // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      clientId: "381062206141-d6emaqaohj2dtnsbod3t6951p543k78k.apps.googleusercontent.com",
      clientSecret: "TsJe2a4RLWf9tuMo4EQDGfHZ",
      refreshToken: "1/JSBtCwAeDVeV8iCDRg0Tg4esLsMkFJUv0_Ms1qSUOU4"
    }
  }
});

var mailOptions = {
  from: "thargyee@gmail.com",
  to: "thargyee@gmail.com",
  subject: "Hello",
  generateTextFromHTML: true,
  html: "<b>Hello world</b>"
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
    res.json({
                        type: false,
                        data: 'Cannot sendMail'
                      });

  } else {
    console.log(response);
    res.json({
                        type: true,
                        data: 'Mail send'
                      });
  }
  smtpTransport.close();
});

  
});



//client ID
//381062206141-d6emaqaohj2dtnsbod3t6951p543k78k.apps.googleusercontent.com 
//client secret 
//TsJe2a4RLWf9tuMo4EQDGfHZ 
//Refresh token
//1/JSBtCwAeDVeV8iCDRg0Tg4esLsMkFJUv0_Ms1qSUOU4
//Access token
//ya29.TwKTh8TUfQeMpYB5lqVeSWewzfrPBLxO9kT9tVswrWXxY9hIQPjsKXuj-is6XXLDC3th

/* GET users listing. */

//{"username":"user02","password":"123"}
router.post('/login', function(req, res) {
console.log(req.body);
 var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');

User.findOne({username: req.body.username, password: hash}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } 
        else {
          if (user) {
              var privatekey = req.privatekey;
              var publickey = req.publickey;
              var token =  req.jwt.sign({uid:user._id}, privatekey, { algorithm: 'RS256'});
              res.json({type:true,token:token});
            }
            else{
              res.json({type:false,data:'Invalid Login : User not found'});

            }
        }
    });

});

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({},function(err,data){
          if(err){
                res.json({
                        type: false,
                        data: "Invalid Request"
                      });
              }
              else
              {
                res.json({
                        type: true,
                        data: data
                      });
              }
        });
});




module.exports = router;
