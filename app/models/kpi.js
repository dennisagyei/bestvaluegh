var mongoose = require('mongoose');

var KpiSchema = new mongoose.Schema({
  kpi_name: { type: String },
  kpi_type: { type: String }, //Currency/Percentage
  kpi_image: { type: String }, //KPI image
  category: { type: String, index: true },  //field level index
  description: { type: String },
  ref_url: { type: String },
  featured : { type: String },
  is_active : { type: String }
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Kpi', KpiSchema);
