import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'name' : String,
  'id' : String,
  'ownerId': String,
  'images' : [{
    height: Number,
    url: String,
    width: Number
  }],
  'taggedSongIds' : [String]
})


export default mongoose.model("Playlist", schema)