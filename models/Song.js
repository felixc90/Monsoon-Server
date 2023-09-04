const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'artistIds' : [String],
  'albumId' : String,
  'duration' : Number,
  'name' : String,
  'popularity' : Number,
})


module.exports = mongoose.model("Song", schema)