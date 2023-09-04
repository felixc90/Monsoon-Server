const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'artistIds' : [String],
  'image' : String,
  'name' : String,
  'releaseDate' : String
})


module.exports = mongoose.model("Album", schema)