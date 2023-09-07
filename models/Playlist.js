const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'name' : String,
  'id' : String,
  'userId': String,
  'image' : String,
  'taggedSongIds' : [String]
})


module.exports = mongoose.model("Playlist", schema)