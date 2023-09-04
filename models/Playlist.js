const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'name' : String,
  'id' : String,
  'userId': String,
  'image' : String,
  'songIds' : [String]
})


module.exports = mongoose.model("Playlist", schema)