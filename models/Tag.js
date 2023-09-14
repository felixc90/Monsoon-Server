import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'name' : String,
  'isCategory' : Boolean,
  'categories': [String]
})


export default mongoose.model("Tag", schema)