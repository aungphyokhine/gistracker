var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

	var hash = crypto.createHash('sha256').update(this.password).digest('base64');
	this.password = hash;
  next();
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
 
module.exports = User;