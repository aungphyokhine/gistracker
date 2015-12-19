var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var lastTrackSchema = new Schema({
  uid: String,
  created_at: Number
});



// the schema is useless so far
// we need to create a model using it
var LastTrack = mongoose.model('LastTrack', lastTrackSchema);
 
module.exports = LastTrack;