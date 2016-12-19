var mongoose = require('mongoose');

var SubscriberSchema = new mongoose.Schema({
  email_address : { type: String },
  status : { type: String },
  phone : { type: String },
  list_id : { type: String },
  merge_fields : {
    FNAME: String,
    LNAME :  String,
    PHONE :  String
  }
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Subscriber', SubscriberSchema);
