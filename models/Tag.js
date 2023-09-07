const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'name' : String,
  'isCategory' : Boolean,
  'categories': [String]
})


module.exports = mongoose.model("Tag", schema)