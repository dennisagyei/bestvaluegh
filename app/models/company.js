var mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
  name: { type: String },
  website: { type: String },
  logo: { type: String }
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Company', CompanySchema);
