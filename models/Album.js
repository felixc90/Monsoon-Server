import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'artistIds' : [String],
  'images' : [{
    height: Number,
    url: String,
    width: Number
  }],
  'name' : String,
  'releaseDate' : Date
})


export default mongoose.model("Album", schema);