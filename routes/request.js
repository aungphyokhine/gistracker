var express = require('express');
var router = express.Router();
var Request  = require('../models/Request');
var User  = require('../models/User');
/* GET home page. */
router.post('/request_to_me', function(req, res, next) {
  var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            });
	        } 
	        else {
				
				
				Request.find({to_uid:decoded.uid},function(err,data){
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

	       
			}		
		});
  
});

/* GET home page. */
router.post('/request_from_me', function(req, res, next) {
  var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            });
	        } 
	        else {
				
				
				Request.find({from_uid:decoded.uid},function(err,data){
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

	       
			}		
		});
  
});



router.post('/new', function(req, res, next) {

 		var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            });
	        } 
	        else {
				
				
	        	//Request.remove({}, function(){});
				User.findOne({username: req.body.username},function(err,user){
					if(err){
								res.json({
								        type: false,
								        data: "Invalid Request"
							        });
	        		}
	        		else
	        		{

	        			Request.update({ to_uid :user._id, from_uid:decoded.uid }, { $set: {to_uid :user._id, from_uid:decoded.uid,accpet :false} }, { upsert: true }, function(err,data){
	        				if(err){
	        						res.json({
								        type: false,
								        data: "Request Fail"
							        });
	        					}
	        				else{
	        						res.json({
								        type: true,
								        data: "Request saved"
							        });

	        				}
	        			});

	        			
	        		}
				});

	       
			}		
		});
  
		
		             
});


router.post('/accept', function(req, res, next) {

 		var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            });
	        } 
	        else {
				
			

				Request.findOneAndUpdate({_id: req.body.request_id},{accpet :true},function(err,data){
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

	       
			}		
		});
  
		
		             
});



module.exports = router;
