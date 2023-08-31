const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'spotifyId' : String
  'userId': String,
  'tagIds' : [String]
})


module.exports = mongoose.model("Song", schema)