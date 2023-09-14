import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'name' : String,
})


export default mongoose.model("Artist", schema);