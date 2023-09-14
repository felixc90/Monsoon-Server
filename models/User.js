import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'name' : String,
  'playlistIds' : [String],
  'taggedSongIds' : [String],
  'oauth2Token' : {
    'refreshToken' : String,
    'accessToken' : String,
    'expiresAt' : Date,
    // maybe more
  }
})

export default mongoose.model("User", schema)