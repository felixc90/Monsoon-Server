const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'userId': String,
  'tags': [{
    'tag': String,
    'value': String
  }],
  'songId' : String
})


module.exports = mongoose.model("TaggedSong", schema)