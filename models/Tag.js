const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'userId': String,
  'songIds' : [String],
  'isCategory' : Boolean,
  'categories': [String]
})


module.exports = mongoose.model("Tag", schema)