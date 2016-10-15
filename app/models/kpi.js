var mongoose = require('mongoose');

var KpiSchema = new mongoose.Schema({
  kpi_name: { type: String },
  kpi_value: { type: Number },
  kpi_type: { type: String }, //Currency/Percentage
  kpi_image: { type: String }, //KPI image
  category: { type: [String], index: true },  //field level index
  description: { type: String },
  visit_url: { type: String },
  rating: { type: Number },
  featured : { type: Boolean },
  is_active : { type: Boolean },
  company: { type: String },
  company_id : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Kpi', KpiSchema);
