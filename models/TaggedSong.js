import mongoose from 'mongoose';

var schema = mongoose.Schema({
  'id' : String,
  'userId': String,
  'tags': [{
    'tag': String,
    'value': String
  }],
  'songId' : String
})


export default mongoose.model("TaggedSong", schema);