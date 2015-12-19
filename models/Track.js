var mongoose     = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var trackSchema = new Schema({
  uid: String,
  type:String,
  coordinates: { type: [Number], index: '2dsphere'},
  created_at: Number,
  updated_at: Date
});



trackSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;


  next();
});

// the schema is useless so far
// we need to create a model using it
//var geo = mongoose.model('geo', geoInfoSchema);
var Track = mongoose.model('Track', trackSchema);
// module.exports = geo;
module.exports = Track;
