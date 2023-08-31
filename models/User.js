const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'name' : String,
  'playlistIds' : [String],
  'songIds' : [String],
  'refreshToken' : String,
  'accessToken' : String
})


module.exports = mongoose.model("User", schema)