var express = require('express');
var router = express.Router();
var User  = require('../models/User');
var crypto = require('crypto');

//{"username":"user02","password":"123"}
router.post('/add', function(req, res, next) {
//console.log(req.body);

//User.remove({}, function(){});
var newuser = new User(req.body);

newuser.save(function (err, adduser) {
  if (err){
      if (err.code !== 11000 ) {
       res.json({type:false,data: "Error occured: " + err.code});
      return;
      }
      else{
          res.json({type:false,data: "User already exists"});
          return;
      }
  
  } 
  else{
    var privatekey = req.privatekey;
    var publickey = req.publickey;
    var token =  req.jwt.sign({uid:adduser._id}, privatekey, { algorithm: 'RS256'});
    res.json({type:true,token:token});
  }
});

 
//User.find().lean().exec(function (err, users) {
  //  return res.end(JSON.stringify(users));
//});

  
});
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
