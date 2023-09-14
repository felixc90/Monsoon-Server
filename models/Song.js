import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'artistIds' : [String],
  'albumId' : String,
  'duration' : Number,
  'name' : String,
  'popularity' : Number,
})


export default mongoose.model("Song", schema);