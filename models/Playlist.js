const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'userId': String,
  'songIds' : [String]
})


module.exports = mongoose.model("Playlist", schema)