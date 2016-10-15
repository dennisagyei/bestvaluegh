// app/models/demo.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our demo model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Demo', {
    name : {type : String, default: '', required: true},
    phone : {type : String, default: '', required: true}
});