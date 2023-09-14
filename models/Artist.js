import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'genres' : [String],
  'name' : String,
  'popularity' : Number
})


export default mongoose.model("Artist", schema);