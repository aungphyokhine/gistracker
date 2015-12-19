var express = require('express');
var router = express.Router();
var Track  = require('../models/Track');
var LastTrack  = require('../models/LastTrack');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//<longitude>, <latitude>
//{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI1NjcxNmY4ODQ0YmIyZmYwMDYwNGI3Y2UiLCJpYXQiOjE0NTAyNzQ2OTZ9.Mx78KA0xpHRg3yVQWznCcPIKkKFzV5ASJQf4ddjj_nu5bg0xAkUkBU3jEKJIJkHnZlT3YtSHHitAfHZNwzAL3Cbki97_YgsCTahkHiizc7ciBYkqqT-aYoV-aMDSlrV1RXhREQaarF6b7d8hSzCMXL8LGebQy0_FyPqJNSxuzjmFi3S1mFs8lJ-2-XmLuYYrurmz3atMwvN2zsQhgFUogmAlGXhoSk3HoyHjvNBK5qDK85uUGTLyoUZTFFh13_sWBn5ojDufJIwx8b7CFp6TPXPRT0IVNRqc2PhJFzRewznWFUtMH6jf4xYEJ6FrsNlYzy8y-qwxeoc4Bt9S8XPxzw","tracks":[{"type":"pubic","created_at":1,"coordinates":[0,1]}]}
router.post('/tracks/add', function(req, res, next) {

 		var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
                type: false,
                data: "Authentication Fail : Invalid Token" 
            });
	        } 
	        else {
				var TrackArray = req.body.tracks;


	        	//var uid = decoded.uid;
	        	var lasttime = 0;

	        	for(track in TrackArray){
	        		TrackArray[track].uid = decoded.uid;
	        		//console.log(TrackArray[track]);
	        		

	        		if(lasttime < TrackArray[track].created_at){
					lasttime = TrackArray[track].created_at;
					}
	        		//to mark the max date n insert for last track
	        		
	        	}


	        	Track.create(TrackArray,function(err,data){
	        		if(err){
								res.json({
							        type: false,
							        data: "Saving Fail"
							        });
	        		}
	        		else
	        		{

	        			LastTrack.update({ uid:decoded.uid }, { $set: { created_at: lasttime } }, { upsert: true }, function(){
	        				//LastTrack.find({uid:decoded.uid},function(err,data){
	        				//console.log(data);
	        				//});
	        			});
	        					res.json({
							        type: false,
							        data: "Saving successes"
							        });
	        		}

	        	});
	        	
	        	//Track.find({uid:decoded.uid},function(err,data){
	        	//	console.log(data);
	        	//});
			
			}		
		});
  
		
		             
});


//{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI1NjcxNmY4ODQ0YmIyZmYwMDYwNGI3Y2UiLCJpYXQiOjE0NTAyNzQ2OTZ9.Mx78KA0xpHRg3yVQWznCcPIKkKFzV5ASJQf4ddjj_nu5bg0xAkUkBU3jEKJIJkHnZlT3YtSHHitAfHZNwzAL3Cbki97_YgsCTahkHiizc7ciBYkqqT-aYoV-aMDSlrV1RXhREQaarF6b7d8hSzCMXL8LGebQy0_FyPqJNSxuzjmFi3S1mFs8lJ-2-XmLuYYrurmz3atMwvN2zsQhgFUogmAlGXhoSk3HoyHjvNBK5qDK85uUGTLyoUZTFFh13_sWBn5ojDufJIwx8b7CFp6TPXPRT0IVNRqc2PhJFzRewznWFUtMH6jf4xYEJ6FrsNlYzy8y-qwxeoc4Bt9S8XPxzw"}
router.post('/tracks/last', function(req, res, next) {
	var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            	});
	        } 
	        else {
				LastTrack.findOne({uid:decoded.uid},function (err, track) {
				if(err){
						res.json({
		                type: false,
		                data: "Error in search : Try Again"
            		});
				
	        	} 
	        	else{
					console.log(track);
						if(track){
								res.json({
							    	type: true,
							        data: track
							    });
							}
						else{
								res.json({
								    	type: true,
								        data: {uid:decoded.uid,created_at:0}
								});
							}
					}
					
				});

	        }
	    });
		
});


//{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI1NjcxNmY4ODQ0YmIyZmYwMDYwNGI3Y2UiLCJpYXQiOjE0NTAyNzQ2OTZ9.Mx78KA0xpHRg3yVQWznCcPIKkKFzV5ASJQf4ddjj_nu5bg0xAkUkBU3jEKJIJkHnZlT3YtSHHitAfHZNwzAL3Cbki97_YgsCTahkHiizc7ciBYkqqT-aYoV-aMDSlrV1RXhREQaarF6b7d8hSzCMXL8LGebQy0_FyPqJNSxuzjmFi3S1mFs8lJ-2-XmLuYYrurmz3atMwvN2zsQhgFUogmAlGXhoSk3HoyHjvNBK5qDK85uUGTLyoUZTFFh13_sWBn5ojDufJIwx8b7CFp6TPXPRT0IVNRqc2PhJFzRewznWFUtMH6jf4xYEJ6FrsNlYzy8y-qwxeoc4Bt9S8XPxzw","from":0,"to":90941999}
router.post('/tracks', function(req, res, next) {
	var publickey = req.publickey;
		req.jwt.verify(req.body.token, publickey, function(err, decoded) {

			if(err){
				res.json({
	                type: false,
	                data: "Authentication Fail : Invalid Token" 
            	});
	        } 
	        else {

	        	Track.find({'$and':[{uid:decoded.uid},{created_at:{"$lt" : req.body.to,"$gt" : req.body.from}}]},function(err,data){
					if(err){
							console.log(err);
							res.json({
			                type: false,
			                data: "Error in search : Try Again"
			            		});
						
			        	} 
			        	else{
			        		console.log(data);
							//console.log(tracks);
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
