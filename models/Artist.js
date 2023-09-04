const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'genres' : [String],
  'name' : String,
  'popularity' : Number
})


module.exports = mongoose.model("Artist", schema)